# Timers Component Library

## 📁 Structure

```
Timers/
├── index.ts                        # Main exports
├── README.md                       # This file
├── shared/
│   ├── TimerManager.ts            # Shared interval management service
│   ├── timer.types.ts             # Shared TypeScript types
│   ├── timer.utils.ts             # Shared utility functions
│   └── useTimerEvents.ts          # Shared event handling hook
├── CountdownTimer/
│   ├── CountdownTimer.tsx         # Individual countdown timer component
│   ├── CountdownTimer.styles.ts   # Component-specific styles
│   ├── useCountdownLogic.ts       # Countdown-specific logic hook
│   └── countdown.utils.ts         # Countdown-specific utilities (if needed)
└── SnoozeTimer/
    ├── SnoozeTimer.tsx            # Snooze/repeat timer component
    ├── SnoozeTimer.styles.ts      # Component-specific styles
    ├── useSnoozeLogic.ts          # Snooze-specific logic hook
    └── snooze.utils.ts            # Snooze-specific utilities (repeat logic)
```

---

## 🎯 Design Principles

### **1. Separation of Concerns**

- **Shared logic** in `shared/` (timer management, events, utilities)
- **Component-specific logic** in component folders
- **Pure UI components** that consume hooks

### **2. Single Responsibility**

- Each file has one clear purpose
- Components focus on rendering
- Hooks handle business logic
- Utils provide pure functions

### **3. Composition Over Inheritance**

- Components compose shared hooks
- Shared utilities are imported, not extended
- Each component maintains its own state

---

## 📊 Shared vs Component-Specific

### **Shared (`shared/`)**

#### **TimerManager.ts**

- Interval management (start/stop/clear)
- Active timer tracking
- Centralized cleanup

#### **timer.types.ts**

- Common interfaces
- Event callback types
- Timer state types

#### **timer.utils.ts**

- Sound functions (tick, complete)
- Time calculations (elapsed, event numbers)
- Tick interval calculations

#### **useTimerEvents.ts** (New!)

- Unified event handling
- Tick event detection
- Complete/repeat event firing
- Event deduplication with `useRef`

---

### **CountdownTimer-Specific**

#### **CountdownTimer.tsx**

- Displays individual timer for a slot
- Shows `MM:SS` format
- Integrates with `TimersContext`

#### **useCountdownLogic.ts**

- Manages single timer lifecycle
- Tracks remaining time
- Handles completion → `status: 'completed'`
- Updates timer in context

---

### **SnoozeTimer-Specific**

#### **SnoozeTimer.tsx**

- Displays repeating snooze countdown
- Shows `MM:SS` format
- Only visible when completed timers exist

#### **useSnoozeLogic.ts**

- Manages repeating cycles
- Detects completed timers
- Handles debounce mode
- Calculates cycle numbers

#### **snooze.utils.ts**

- Cycle number calculations
- Repeat-specific logic

---

## 🔄 Migration Path

### **Phase 1: Create Structure** ✅

1. Create `Timers/` folder
2. Create `shared/` subfolder
3. Create component subfolders

### **Phase 2: Move Shared Logic**

1. Extract common utilities to `shared/timer.utils.ts`
2. Move `TimerManager.ts` to `shared/`
3. Create `shared/timer.types.ts`
4. Create `shared/useTimerEvents.ts`

### **Phase 3: Reorganize Components**

1. Move `Timer.tsx` → `CountdownTimer/CountdownTimer.tsx`
2. Rename `useTimerLogic` → `useCountdownLogic`
3. Move `SnoozeTimer` files to subfolder
4. Rename hook to `useSnoozeLogic`

### **Phase 4: Update Imports**

1. Update all imports to use new paths
2. Re-export from `index.ts`
3. Update component consumers

---

## 📦 Exports

```typescript
// Timers/index.ts

// Components
export { CountdownTimer } from './CountdownTimer/CountdownTimer';
export { SnoozeTimer } from './SnoozeTimer/SnoozeTimer';

// Shared utilities
export { timerManager } from './shared/TimerManager';
export { useTimerEvents } from './shared/useTimerEvents';

// Types
export type * from './shared/timer.types';
```

---

## 🎯 Benefits

### **1. Discoverability**

- All timer-related code in one place
- Clear separation between shared and specific

### **2. Maintainability**

- Shared changes update both components
- Component-specific changes isolated
- Easy to add new timer types

### **3. Testability**

- Test shared logic once
- Test components independently
- Mock shared dependencies easily

### **4. Reusability**

- Want a new timer type? Use shared utilities!
- Consistent event handling
- Consistent sound/visual feedback

---

## 🚀 Future Timer Types

With this structure, adding new timer types is easy:

```
Timers/
├── shared/            # Reuse existing shared logic
├── CountdownTimer/    # Individual slot timers
├── SnoozeTimer/       # Repeating alarm timer
├── IntervalTimer/     # NEW: Repeating workout timer
├── PomodoroTimer/     # NEW: Work/break cycles
└── StopwatchTimer/    # NEW: Count-up timer
```

Each new timer:
1. Creates its own subfolder
2. Implements its own component + hook
3. **Reuses** shared utilities
4. Adds to `index.ts` exports

---

## 💡 Example Usage

```typescript
// Before (scattered):
import { Timer } from 'components/Timer/Timer';
import { SnoozeTimer } from 'components/SnoozeTimer/SnoozeTimer';

// After (organized):
import { CountdownTimer, SnoozeTimer } from 'components/Timers';
```

Clean, organized, and scalable! 🎉

