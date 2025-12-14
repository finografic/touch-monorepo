# Timer and Session Storage System

📅 Nov 19, 2025

## Overview

This document describes how the timer management, session storage, and filter persistence systems work together in the Touch Monorepo application.

## Core Systems

### 1. Session Storage Timer System

The session storage timer system manages a 1-hour configuration expiry timer that tracks when product configurations were saved.

#### Components

- **`useStorageTimer` Hook** (`providers/TimersProvider/useStorageTimer.ts`)
  - Checks `sessionStorage` for `CONFIG_TIMESTAMP` every 5 seconds
  - Returns `hasActiveTimer` boolean indicating if the timer is active
  - Returns `remainingTime` in milliseconds
  - Used by UI components to determine if configuration features should be enabled

- **`RecallTimer` Component** (`components/Timers/RecallTimer.tsx`)
  - Displays countdown timer showing when configuration expires
  - Subscribes to heartbeat timer (updates every 1 second)
  - Uses `getSessionTimerStatus()` utility to calculate remaining time
  - Automatically clears expired configuration from sessionStorage

- **`useRecallConfig` Hook** (`hooks/useRecallConfig.ts`)
  - `saveConfig()`: Saves configuration to `touch_last_config` and sets `touch_config_timestamp`
  - `loadConfig()`: Loads and validates saved configuration (checks expiry)
  - `clearConfig()`: Clears both config and timestamp from sessionStorage

#### Storage Keys

- `touch_config_timestamp`: Timestamp when configuration was saved (used to calculate expiry)
- `touch_last_config`: JSON string containing saved configuration:

  ```typescript
  {
    filters: OrderFilters,        // All filter selections (mode, drinkType, etc.)
    temperatures: {                // Temperature values
      default: number,
      initial: number,
      final: number
    },
    durations: {                  // Timer durations per slot type
      default: number,
      A: number,
      B: number,
      C: number
    },
    selectedOrders: number[]       // Array of slot numbers
  }
  ```

### 2. Heartbeat Timer System

A centralized master timer that ticks every second, used by all timer components to stay synchronized.

#### Components

- **`HeartbeatContext`** (`providers/HeartbeatProvider/HeartbeatContext.ts`)
  - Single global interval that updates `tick` and `now` every 1000ms
  - All timer components subscribe to this heartbeat instead of creating their own intervals
  - Provides `useHeartbeat()` hook with `tick` and `now` values

- **Timer Components Using Heartbeat**
  - `Timer.tsx`: Subscribes to heartbeat via `tick` dependency
  - `DefrostTimer.tsx`: Subscribes to heartbeat via `tick` dependency
  - `RecallTimer.tsx`: Subscribes to heartbeat via `tick` dependency
  - `SnoozeTimer.tsx`: Uses heartbeat for countdown updates

#### Benefits

- **Performance**: Single interval instead of multiple per component
- **Synchronization**: All timers update at the same time
- **Consistency**: Prevents timing drift between components

### 3. Session Management System

Sessions track user flows (PROGRAM_TIME or PROGRAM_PRODUCT) and associate slots with configuration data.

#### Session Structure

```typescript
interface ConfigurationSession {
  id: string;                    // Unique session identifier
  flowType: FlowTypeValue;       // 'program-time' | 'program-product'
  createdAt: string;             // ISO timestamp
  filters: OrderFilters;         // Session-specific filters
  slotNumbers: number[];         // Associated slot indexes
  isActive: boolean;             // Whether session is currently active
  isCurrent: boolean;             // Whether this is the current session
  isComplete: boolean;           // Whether session is completed
}
```

#### Key Operations

- **`createSession(flowType, initialFilters?)`**: Creates new session, deactivates others
- **`assignOrdersToSession(sessionId, slotNumbers)`**: Links slot numbers to session
- **`updateSessionFilters(sessionId, filters)`**: Updates session's filter state
- **`setOrdersSession({ slotNumbers, session })`**: Links orders in OrdersContext to session

### 4. Filter Persistence System

Filters are stored in two places:
1. **FiltersContext**: Global filter state (always active)
2. **Session Storage**: Persisted configuration for restoration

#### Filter Flow

1. **During Product Flow**:
   - User selects filters (mode, drinkType, etc.) → stored in FiltersContext
   - When START is clicked → filters saved to sessionStorage via `saveConfig()`
   - Filters include: mode, drinkType, drinkSubtype, drinkVolume, containerType, temperature (with profiles)

2. **On Repeat Selection**:
   - Loads `touch_last_config` from sessionStorage
   - Extracts `filters` object
   - Applies each filter to FiltersContext using `setFilter()`
   - Creates timers for selected slots using saved durations

### 5. Selected Slots Persistence

Selected slots are managed in two contexts:

#### LayoutUiContext (UI State)

- `selectedSlots`: Array of `SlotMeta[]` for UI display
- Managed by `setSelectedSlots()`, `toggleMainPageSlot()`, etc.
- **Not persisted** - cleared on navigation

#### SessionContext (Persistent State)

- `slotNumbers`: Array of numbers stored in session
- **Persisted** - survives navigation
- Restored when navigating back to MainPage

#### Restoration Flow

When navigating back to MainPage:
1. `MainPage.tsx` checks `currentSessionId` and `sessions[currentSessionId]`
2. Extracts `slotNumbers` from session
3. Rebuilds `SlotMeta[]` objects using `orderItemsConfig`
4. Calls `setSelectedSlots()` to restore UI state

## System Interactions

### Product Flow → Storage Timer

```
User completes product flow
  ↓
START button clicked
  ↓
Timers created (addTimer)
  ↓
saveConfig() called with:
  - filters: current FiltersContext state
  - temperatures: initial/final values
  - durations: calculated per slot type
  - selectedOrders: slot numbers
  ↓
CONFIG_TIMESTAMP set to Date.now()
  ↓
hasActiveTimer becomes true
  ↓
RecallTimer displays countdown
  ↓
SnoozeTimer becomes active (if completed timers exist)
```

### Repeat Selection Flow

```
User clicks "Repetir Selección"
  ↓
Check: hasActiveTimer === true? (button disabled if false)
  ↓
Check: CONFIG_TIMESTAMP exists and not expired?
  ↓
Load: touch_last_config from sessionStorage
  ↓
Extract: filters object
  ↓
Apply: Each filter to FiltersContext via setFilter()
  ↓
Create: Timers for selected slots using saved durations
```

### Navigation → Slot Restoration

```
User navigates back to MainPage
  ↓
MainPage useEffect runs
  ↓
Check: currentSessionId exists?
  ↓
Get: session.slotNumbers from SessionContext
  ↓
Rebuild: SlotMeta[] from slotNumbers using orderItemsConfig
  ↓
Call: setSelectedSlots(restoredSlots)
  ↓
UI displays selected slots correctly
```

### SnoozeTimer Activation

```
Storage timer active (hasActiveTimer === true)
  AND
Completed timers exist (status === 'completed')
  ↓
SnoozeTimer starts
  ↓
Counts down from 2 minutes (SNOOZE_INTERVAL_MS)
  ↓
Beeps immediately when starting
  ↓
Beeps every 2 minutes while active
  ↓
Stops when:
  - Storage timer expires, OR
  - All completed timers are cleared
```

## Key Dependencies

### Storage Timer → Feature Enablement

- **"Repetir Selección" button**: Only enabled when `hasActiveTimer === true`
- **SnoozeTimer**: Only active when `hasActiveTimer === true`
- **RecallTimer**: Only displays when timer is active

### Session → Slot Persistence

- **Selected slots**: Persisted in `session.slotNumbers`
- **Restoration**: MainPage rebuilds `selectedSlots` from session on mount
- **Linking**: `setOrdersSession()` links orders to session for proper association

### Filters → Configuration

- **Global state**: FiltersContext holds current filter selections
- **Persistence**: Filters saved to sessionStorage in `touch_last_config.filters`
- **Restoration**: Filters applied to FiltersContext when repeating selection

## Data Flow Diagram

```
┌─────────────────┐
│  Product Flow   │
│  (User Actions) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│ FiltersContext │────▶│  SessionStorage │
│  (Global State)│     │ touch_last_config│
└────────────────┘     └──────────────────┘
         │                       │
         │                       ▼
         │              ┌──────────────────┐
         │              │ CONFIG_TIMESTAMP │
         │              └────────┬──────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌──────────────────┐
│  SessionContext │     │ useStorageTimer │
│  (slotNumbers)  │     │ hasActiveTimer  │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │                       ▼
         │              ┌──────────────────┐
         │              │  RecallTimer     │
         │              │  SnoozeTimer     │
         │              │  Repeat Button   │
         │              └──────────────────┘
         │
         ▼
┌─────────────────┐
│  MainPage       │
│  (Restoration)  │
└─────────────────┘
```

## Best Practices

1. **Always use `saveConfig()` when creating timers** - Ensures storage timer is set
2. **Check `hasActiveTimer` before enabling features** - Prevents access to expired configs
3. **Use `loadConfig()` instead of direct sessionStorage access** - Handles expiry validation
4. **Store slotNumbers in session, not SlotMeta[]** - More efficient and reliable
5. **Restore selectedSlots from session on MainPage** - Ensures UI consistency

## Configuration Constants

- `CONFIG_EXPIRY_TIME_MS`: 3,600,000ms (1 hour)
- `SNOOZE_INTERVAL_MS`: 120,000ms (2 minutes)
- `POLLING_INTERVAL_MS`: 1,000ms (1 second for UI updates)
- Heartbeat interval: 1,000ms (1 second)

