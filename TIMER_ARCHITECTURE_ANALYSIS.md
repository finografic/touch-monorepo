# Timer Architecture Analysis

## Overview

The timer system uses **three complementary layers**:

1. **TimersContext** (Zustand Store) - **State Management Layer**
2. **TimerSubscriptionRegistry** - **Callback Management Layer**
3. **Heartbeat Store** (Service) - **Single Source of Truth for Time**

**Key Optimization**: Only **ONE** `setInterval` exists in the entire app (in `heartbeat.store.ts`). All timers subscribe to this single heartbeat instead of creating their own intervals.

---

## 1. TimersContext (Zustand Store)

### Purpose

**State management** for timer data and metadata.

### Responsibilities

- ✅ Stores timer **data** (timers array, maintenance timers, recall config)
- ✅ Provides CRUD operations (`addTimer`, `updateTimer`, `removeTimer`)
- ✅ Provides query methods (`getTimerBySlotNumber`, `getRunningTimers`, etc.)
- ✅ Manages timer **metadata** (status, duration, completionTime, orderId, sessionId)
- ✅ Persists state across navigation (React Context + Zustand)
- ✅ Manages recall configuration system

### Location

- `apps/client/src/providers/TimersProvider/TimersContext.ts`
- Wrapped in `App.tsx` at high level (line 37)

### Data Structure

```typescript
{
  timers: TimerItem[],           // Main timers (from Program Time/Product flows)
  maintenance: TimerBasic[],     // Maintenance timers
  recall: RecallState,           // Recall config system
  snooze: boolean                // Global snooze state
}
```

### Key Methods

- `addTimer()` - Creates/updates timer in state
- `updateTimer()` - Updates timer metadata
- `removeTimer()` - Removes timer from state
- `getTimerBySlotNumber()` - Query by slot
- `setRecallConfig()` - Manages recall system

---

## 2. Heartbeat Store (Service)

### Purpose

**Single source of truth** for time updates across the entire application.

### Responsibilities

- ✅ Runs the **only** `setInterval` in the app (1 second interval)
- ✅ Provides global `tick` counter and `now` timestamp
- ✅ Automatically started when imported in `main.tsx`
- ✅ All timers subscribe to this instead of creating their own intervals

### Location

- `apps/client/src/providers/HeartbeatProvider/heartbeat.store.ts`
- Imported in `main.tsx` (line 10) - starts automatically

### Data Structure

```typescript
{
  tick: number,    // Incrementing counter (0, 1, 2, ...)
  now: number      // Current timestamp (Date.now())
}
```

### How It Works

```typescript
// Single interval runs every 1000ms
setInterval(() => {
  heartbeatStore.setState((s) => ({
    tick: s.tick + 1,
    now: Date.now(),
  }));
}, 1000);
```

### Key Benefit

**Optimization**: Instead of having N intervals (one per timer), we have **1 interval** that all timers subscribe to.

---

## 3. TimerSubscriptionRegistry

### Purpose

**Callback management** for slot-based timers that subscribe to heartbeat.

### Responsibilities

- ✅ Manages callbacks for slot-based timers
- ✅ Subscribes to heartbeat store (single subscription)
- ✅ Calls all registered callbacks when heartbeat ticks
- ✅ Prevents duplicate callbacks per slot
- ✅ Automatic cleanup when no callbacks remain

### Location

- `apps/client/src/components/Timers/shared/TimerSubscriptionRegistry.ts`
- Singleton instance: `timerSubscriptionRegistry` (also exported as `timerRegistry` for convenience, and `timerManager` for backward compatibility)

### Data Structure

```typescript
{
  callbacks: Map<number, TimerCallback>,
  isActive: (slotNumber: number) => boolean,
  register: (slotNumber: number, callback: TimerCallback) => void,
  unregister: (slotNumber: number) => void,
  clearAll: () => void,
  getActiveSlots: () => number[]
}
```

### Key Methods

- `register()` - Registers callback for a slot (subscribes to heartbeat if first)
- `unregister()` - Removes callback for a slot (unsubscribes if last)
- `clearAll()` - Removes all callbacks and unsubscribes
- `isActive()` - Checks if slot has registered callback

### How It Works

```typescript
// Single subscription to heartbeat
heartbeatStore.subscribe((state) => {
  // Call all registered callbacks when heartbeat ticks
  callbacks.forEach((callback) => {
    callback();
  });
});
```

---

## 4. useHeartbeatSubscription Hook

### Purpose

**React hook** for components that need direct access to heartbeat updates.

### Responsibilities

- ✅ Subscribes component to heartbeat store
- ✅ Returns current `now` timestamp
- ✅ Automatically updates when heartbeat ticks
- ✅ Handles subscription cleanup

### Location

- `apps/client/src/components/Timers/shared/useHeartbeatSubscription.ts`

### Usage

```typescript
const now = useHeartbeatSubscription(); // Updates every second
```

### When to Use

- Global timers that don't need slot-based callback management
- Components that just need the current timestamp
- Simpler than using TimerRegistry for non-slot timers

---

## 5. How They Work Together

### Pattern 1: Slot-Based Timers (Timer.tsx, UserTimer.tsx)

```typescript
// 1. Get timer STATE from TimersContext
const { timer, updateTimer } = useTimers({ slotNumber });

// 2. Register callback with TimerSubscriptionRegistry (subscribes to heartbeat service)
useEffect(() => {
  if (timer?.status === 'processing') {
    timerRegistry.register(slotNumber, () => {
      // This callback runs every heartbeat tick (1 second)
      const { remaining } = parseCompletionTime(timer);
      setRemainingTime(remaining);

      if (remaining <= 0) {
        updateTimer(timer.id, { status: 'completed' });
        timerRegistry.unregister(slotNumber);
      }
    });
  }

  return () => timerRegistry.unregister(slotNumber);
}, [timer]);
```

**Flow:**
1. Heartbeat service ticks (1 second interval)
2. TimerSubscriptionRegistry's heartbeat subscription fires
3. All registered callbacks are called
4. Each callback updates its component's state

### Pattern 2: Global Timers (SnoozeTimer.tsx, RecallTimer.tsx)

```typescript
// Direct subscription to heartbeat via hook
const now = useHeartbeatSubscription();

// React to heartbeat updates
useEffect(() => {
  const { remaining } = parseElapsedTime({ startTime, now });
  setRemainingTime(remaining);
}, [now, startTime]);
```

**Flow:**
1. Heartbeat ticks (1 second interval)
2. `useHeartbeatSubscription` hook receives update
3. Component re-renders with new `now` value
4. `useEffect` recalculates based on new `now`

### Separation of Concerns

- **TimersContext**: "What is the timer's state?" (data, metadata, business logic)
- **TimerSubscriptionRegistry**: "How do slot-based timers update?" (registry that subscribes to service)
- **Heartbeat Store**: "When do timers update?" (single source of truth for time)
- **useHeartbeatSubscription**: "Direct access to heartbeat for simple components"

---

## 6. Current Usage Analysis

### ✅ Uses TimersContext + TimerSubscriptionRegistry

- `Timer.tsx` - Main timer component (slot-based)
- `UserTimer.tsx` - Maintenance timer component (slot-based)
- `AdminSlotTimer.tsx` - Admin timer component (slot-based)

### ✅ Uses TimersContext + useHeartbeatSubscription

- `SnoozeTimer.tsx` - Global snooze timer (direct heartbeat subscription)
- `RecallTimer.tsx` - Global recall timer (direct heartbeat subscription)

### Why Two Patterns?

**Slot-Based Timers** → Use `TimerSubscriptionRegistry`:
- Need per-slot callback management
- Benefit from centralized callback coordination
- Can register/unregister callbacks dynamically

**Global Timers** → Use `useHeartbeatSubscription`:
- Don't need slot-based management
- Simpler - just need current timestamp
- React hook pattern is more natural for component state

---

## 7. Optimization Benefits

### ✅ **Single Interval**

- **Before**: N intervals (one per timer component)
- **After**: 1 interval (heartbeat.store.ts)
- **Result**: Massive performance improvement, especially with many timers

### ✅ **Centralized Time Source**

- All timers use the same `now` timestamp
- No drift between timers
- Consistent timing across the app

### ✅ **Automatic Cleanup**

- TimerSubscriptionRegistry unsubscribes from heartbeat service when no callbacks remain
- Components using `useHeartbeatSubscription` automatically cleanup on unmount
- No memory leaks from orphaned intervals

### ✅ **Scalability**

- Adding more timers doesn't create more intervals
- All timers share the same heartbeat subscription
- Performance doesn't degrade with timer count

---

## 8. Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    heartbeat.store.ts                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │  setInterval(() => { tick++, now = Date.now() })  │  │
│  │  (ONLY interval in entire app)                    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
                        │ (subscribes)
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌───────────────────┐         ┌──────────────────────┐
│TimerSubscription   │         │ useHeartbeatSub       │
│Registry            │         │ (direct access)       │
│(slot callbacks)    │         │                       │
└───────────────────┘         └──────────────────────┘
        │                               │
        │                               │
        ▼                               ▼
┌───────────────────┐         ┌──────────────────────┐
│  Timer.tsx         │         │  SnoozeTimer.tsx     │
│  UserTimer.tsx     │         │  RecallTimer.tsx     │
└───────────────────┘         └──────────────────────┘
        │
        │ (reads state)
        ▼
┌───────────────────┐
│  TimersContext    │
│  (Zustand Store)  │
└───────────────────┘
```

---

## 9. Summary

| Aspect | TimersContext | TimerSubscriptionRegistry | Heartbeat Store |
|--------|---------------|---------------------------|-----------------|
| **Purpose** | State Management | Callback Management | Time Source (Service) |
| **Stores** | Timer data/metadata | Callback map | tick, now |
| **Scope** | Global (React Context) | Singleton registry | Singleton service |
| **Used By** | All timer components | Slot-based timers | All timers (indirectly) |
| **Key Benefit** | Persistence, queries | Centralized callbacks | Single interval |

### ✅ **Conclusion**

The architecture is **highly optimized** with clear separation of concerns:

- **TimersContext** = "What is the timer?" (data/state)
- **TimerSubscriptionRegistry** = "How do slot timers update?" (registry that subscribes to service)
- **Heartbeat Store** = "When do timers update?" (the service - single time source)
- **useHeartbeatSubscription** = "Direct heartbeat service access" (simple components)

**Key Achievement**: Only **ONE** `setInterval` in the entire application, regardless of how many timers are active. All timers subscribe to this single heartbeat, providing excellent performance and scalability.
