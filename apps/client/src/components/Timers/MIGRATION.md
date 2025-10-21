# Migration Guide: Timer Components Consolidation

## 🎯 Goal

Consolidate `Timer` and `SnoozeTimer` into a unified `Timers/` library with:
- Shared utilities in `shared/`
- Component-specific code in subfolders
- Clean, organized exports from `index.ts`

---

## 📊 Current Structure (Before)

```
components/
├── Timer/
│   ├── Timer.tsx
│   ├── TimerManager.ts
│   ├── useTimerLogic.ts
│   └── timers.utils.ts
└── SnoozeTimer/
    ├── SnoozeTimer.tsx
    ├── SnoozeTimer.styles.ts
    └── snooze.utils.ts
```

## 🎯 Target Structure (After)

```
components/
└── Timers/
    ├── index.ts                    # Main exports
    ├── README.md
    ├── MIGRATION.md               # This file
    ├── shared/
    │   ├── TimerManager.ts        # ✅ DONE (copied)
    │   ├── timer.types.ts         # ✅ DONE (created)
    │   ├── timer.utils.ts         # ✅ DONE (shared utils)
    │   └── useTimerEvents.ts      # ✅ DONE (new shared hook)
    ├── CountdownTimer/
    │   ├── CountdownTimer.tsx     # TODO: Move from Timer/Timer.tsx
    │   ├── useCountdownLogic.ts   # TODO: Move from Timer/useTimerLogic.ts
    │   └── countdown.utils.ts     # TODO: Move from Timer/timers.utils.ts (if needed)
    └── SnoozeTimer/
        ├── SnoozeTimer.tsx        # TODO: Move from SnoozeTimer/SnoozeTimer.tsx
        ├── SnoozeTimer.styles.ts  # TODO: Move from SnoozeTimer/SnoozeTimer.styles.ts
        ├── useSnoozeLogic.ts      # TODO: Extract from SnoozeTimer.tsx
        └── snooze.utils.ts        # TODO: Move from SnoozeTimer/snooze.utils.ts
```

---

## ✅ Phase 1: Create Structure (DONE)

- [x] Create `Timers/` folder
- [x] Create `shared/` subfolder
- [x] Create `shared/timer.types.ts`
- [x] Create `shared/timer.utils.ts`
- [x] Create `shared/useTimerEvents.ts`
- [x] Copy `TimerManager.ts` to `shared/`
- [x] Create `index.ts` with exports
- [x] Create `README.md` and `MIGRATION.md`

---

## 📝 Phase 2: Move CountdownTimer (TODO)

### Step 1: Create CountdownTimer folder

```bash
mkdir -p apps/client/src/components/Timers/CountdownTimer
```

### Step 2: Move and rename files

```bash
# Move component
mv apps/client/src/components/Timer/Timer.tsx \
   apps/client/src/components/Timers/CountdownTimer/CountdownTimer.tsx

# Move hook
mv apps/client/src/components/Timer/useTimerLogic.ts \
   apps/client/src/components/Timers/CountdownTimer/useCountdownLogic.ts
```

### Step 3: Update imports in CountdownTimer.tsx

```typescript
// Before:
import { timerManager } from './TimerManager';
import { completeAction, getElapsedTimeAndEventNumber, tickAction } from './timers.utils';

// After:
import { timerManager } from '../shared/TimerManager';
import { getElapsedTimeAndEventNumberSec, playCompleteSound, playTickSound } from '../shared/timer.utils';
import { useTimerEvents } from '../shared/useTimerEvents';
```

### Step 4: Refactor to use shared hook

**Before:**

```typescript
const lastEventFiredRef = useRef<number>(-1);

// Manual event handling
const { elapsed, eventNumber } = getElapsedTimeAndEventNumber(timer.duration, remaining);
if (eventNumber > lastEventFiredRef.current) {
  lastEventFiredRef.current = eventNumber;
  tickAction({ elapsed, remaining, orderId: timer.orderId, eventNumber });
}
```

**After:**

```typescript
const { handleTickEvent, handleCompleteEvent } = useTimerEvents({
  onTick: ({ elapsed, remaining, eventNumber }) => {
    playTickSound().catch(() => {});
  },
  onComplete: ({ elapsed, remaining, orderId }) => {
    console.log('timer: COMPLETED.', { elapsed, remaining, orderId });
    playCompleteSound().catch(() => {});
  },
});

// In update loop:
const { elapsed, eventNumber } = getElapsedTimeAndEventNumberSec(timer.duration, remaining);
handleTickEvent(eventNumber, { elapsed, remaining, orderId: timer.orderId, eventNumber });

// On complete:
handleCompleteEvent({ elapsed, remaining, orderId: timer.orderId });
```

### Step 5: Update index.ts

```typescript
// Before:
export { Timer as CountdownTimer } from '../Timer/Timer';

// After:
export { CountdownTimer } from './CountdownTimer/CountdownTimer';
```

---

## 📝 Phase 3: Move SnoozeTimer (TODO)

### Step 1: Create SnoozeTimer folder

```bash
mkdir -p apps/client/src/components/Timers/SnoozeTimer
```

### Step 2: Move files

```bash
mv apps/client/src/components/SnoozeTimer/* \
   apps/client/src/components/Timers/SnoozeTimer/
```

### Step 3: Extract useSnoozeLogic hook

Create `useSnoozeLogic.ts` with the main snooze logic from `SnoozeTimer.tsx`:

```typescript
// apps/client/src/components/Timers/SnoozeTimer/useSnoozeLogic.ts

import { useEffect, useRef, useState } from 'react';
import { useTimersOptional } from 'providers/TimersProvider';
import { POLLING_INTERVAL_MS, SNOOZE_INTERVAL_MS } from 'config/app';
import { getCycleNumber, getElapsedTimeAndEventNumberMs } from '../shared/timer.utils';
import { useTimerEvents } from '../shared/useTimerEvents';

export interface UseSnoozeLogicProps {
  shouldDebounce?: boolean;
  onTick?: (params: any) => void;
  onRepeat?: (params: any) => void;
}

export const useSnoozeLogic = ({ shouldDebounce = false, onTick, onRepeat }: UseSnoozeLogicProps) => {
  // ... move all logic from SnoozeTimer.tsx
  // ... use useTimerEvents for event handling

  return {
    remainingTime,
    hasCompletedTimers,
    cycleNumber,
  };
};
```

### Step 4: Update SnoozeTimer.tsx to use hook

```typescript
// Before: All logic inline

// After: Clean component using hook
export const SnoozeTimer = ({ shouldDebounce = false }: SnoozeTimerProps) => {
  const { remainingTime, hasCompletedTimers } = useSnoozeLogic({
    shouldDebounce,
    onTick: ({ elapsedMs, remainingMs, eventNumber }) => {
      console.log('🔔 SnoozeTimer: TICK', { elapsedMs, remainingMs, eventNumber });
      playTickSound().catch(() => {});
    },
    onRepeat: ({ elapsedMs, remainingMs, cycleNumber }) => {
      console.log('🔁 SnoozeTimer: REPEAT', { elapsedMs, remainingMs, cycleNumber });
      playCompleteSound().catch(() => {});
    },
  });

  if (!hasCompletedTimers || remainingTime <= 0) {
    return null;
  }

  return (
    <div css={styles}>
      <div className="snooze-timer">
        <span>
          <TimerResetIcon />
          <strong>{formatTimeFromMs(remainingTime)}</strong>
        </span>
      </div>
    </div>
  );
};
```

### Step 5: Update imports in snooze.utils.ts

```typescript
// Before:
import { SNOOZE_INTERVAL_MS } from 'config/app';

// After:
import { getCycleNumber, getElapsedTimeAndEventNumberMs, TICK_INTERVAL_MS } from '../shared/timer.utils';
```

### Step 6: Update index.ts

```typescript
// Before:
export { SnoozeTimer } from '../SnoozeTimer/SnoozeTimer';

// After:
export { SnoozeTimer } from './SnoozeTimer/SnoozeTimer';
```

---

## 📝 Phase 4: Update All Imports (TODO)

Find and replace all imports across the codebase:

### CountdownTimer imports

```bash
# Find all imports of Timer
grep -r "from.*components/Timer" apps/client/src

# Update to:
import { CountdownTimer } from 'components/Timers';
```

### SnoozeTimer imports

```bash
# Find all imports of SnoozeTimer
grep -r "from.*components/SnoozeTimer" apps/client/src

# Update to:
import { SnoozeTimer } from 'components/Timers';
```

### TimerManager imports

```bash
# Find all imports of TimerManager
grep -r "from.*Timer/TimerManager" apps/client/src

# Update to:
import { timerManager } from 'components/Timers';
```

---

## 📝 Phase 5: Cleanup (TODO)

After all imports are updated and tests pass:

```bash
# Remove old folders
rm -rf apps/client/src/components/Timer
rm -rf apps/client/src/components/SnoozeTimer
```

---

## ✅ Testing Checklist

- [ ] CountdownTimer displays correctly for individual slots
- [ ] CountdownTimer plays tick sounds at intervals
- [ ] CountdownTimer completes and triggers completion sound
- [ ] SnoozeTimer appears when timers complete
- [ ] SnoozeTimer repeats every cycle
- [ ] SnoozeTimer disappears when completed timers cleared
- [ ] SnoozeTimer debounce mode works (if enabled)
- [ ] No console errors
- [ ] All imports resolve correctly

---

## 🎯 Benefits After Migration

1. **Organized** - All timer code in one place
2. **DRY** - Shared logic extracted and reused
3. **Scalable** - Easy to add new timer types
4. **Maintainable** - Clear separation of concerns
5. **Testable** - Each piece can be tested independently

---

## 📚 Resources

- See `README.md` for detailed structure explanation
- See `shared/useTimerEvents.ts` for event handling examples
- See `shared/timer.utils.ts` for utility functions

---

## 🙋 Questions?

If you encounter issues during migration:
1. Check that all imports point to correct new paths
2. Verify that shared utilities are working correctly
3. Test each component individually
4. Check console for any missing exports

