# SnoozeTimer Component

📅 Oct 21, 2025

## 🎯 Purpose

A **repeating countdown timer** that automatically starts when timers complete and keeps repeating until all completed timers are cleared.

## ✨ Features

1. **Auto-start**: Automatically starts when ANY timer reaches `status === 'completed'`
2. **Auto-repeat**: Counts down from `SNOOZE_INTERVAL_MS`, then automatically resets and repeats
3. **Context-aware**: Uses `TimersContext` to track completed timers
4. **Auto-stop**: Stops when all completed timers are cleared
5. **Debounce mode** (optional): Restarts countdown when new timers complete
6. **Visual feedback**: Shows countdown with timer icon

## 🔧 Implementation Details

### **State Management**

```typescript
const [remainingTime, setRemainingTime] = useState<number>(0);
const [startTime, setStartTime] = useState<number | null>(null);
```

- `remainingTime`: Milliseconds remaining in current cycle
- `startTime`: Timestamp when snooze started (for calculating cycles)

### **Key Logic**

#### **Auto-repeat using Modulo**

```typescript
const elapsed = now - startTime;
const remaining = SNOOZE_INTERVAL_MS - (elapsed % SNOOZE_INTERVAL_MS);
```

The `%` (modulo) operator creates an **infinite repeating cycle**:
- When `elapsed = 0ms`, remaining = `SNOOZE_INTERVAL_MS - 0 = SNOOZE_INTERVAL_MS`
- When `elapsed = SNOOZE_INTERVAL_MS`, remaining = `SNOOZE_INTERVAL_MS - 0 = SNOOZE_INTERVAL_MS` (resets!)
- Cycle repeats indefinitely

#### **Conditional Rendering**

```typescript
const hasCompletedTimers = timersContext?.timers.some((t) => t.status === 'completed') ?? false;

if (!hasCompletedTimers) {
  setStartTime(null);
  setRemainingTime(0);
  return; // Stop timer
}
```

Timer only runs while there are completed timers.

## 📊 Flow Diagrams

### **Without Debounce** (shouldDebounce = false)

```
Timer A Completes (status = 'completed')
  ↓
hasCompletedTimers = true
  ↓
Start SnoozeTimer (startTime = Date.now())
  ↓
Countdown from 30s → 20s → 10s
  ↓
[Timer B completes - snooze continues uninterrupted]
  ↓
Countdown: 9s → 5s → 0s
  ↓
Auto-reset (modulo operation)
  ↓
Countdown from 30s again
  ↓
(Repeats until completed timers cleared)
  ↓
User clears completed timers
  ↓
hasCompletedTimers = false
  ↓
Stop SnoozeTimer (startTime = null)
```

### **With Debounce** (shouldDebounce = true)

```
Timer A Completes (status = 'completed')
  ↓
hasCompletedTimers = true
  ↓
Start SnoozeTimer (startTime = Date.now())
  ↓
Countdown from 30s → 20s → 10s
  ↓
[Timer B completes - NEW completion detected!]
  ↓
🔄 RESTART SnoozeTimer (startTime = Date.now())
  ↓
Countdown from 30s → 25s → 15s
  ↓
[Timer C completes - NEW completion detected!]
  ↓
🔄 RESTART SnoozeTimer (startTime = Date.now())
  ↓
Countdown from 30s → 20s → ... → 0s
  ↓
Auto-reset (modulo operation)
  ↓
Countdown from 30s again
  ↓
(Repeats until completed timers cleared)
  ↓
User clears completed timers
  ↓
hasCompletedTimers = false
  ↓
Stop SnoozeTimer (startTime = null)
```

## 🔄 Usage

### **Basic Usage (No Debounce)**

Default behavior - timer continues its cycle uninterrupted:

```tsx
import { SnoozeTimer } from 'dev-tools/components/SnoozeTimer';

export const Layout = () => {
  return (
    <div>
      {/* Other layout components */}
      <SnoozeTimer />
    </div>
  );
};
```

### **With Debounce Mode**

Restarts countdown when new timers complete:

```tsx
import { SnoozeTimer } from 'dev-tools/components/SnoozeTimer';

export const Layout = () => {
  return (
    <div>
      {/* Snooze timer will restart on each new completion */}
      <SnoozeTimer shouldDebounce={true} />
    </div>
  );
};
```

### **Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `shouldDebounce` | `boolean` | `false` | When `true`, restarts countdown when a new timer completes. When `false`, continues current cycle. |

### **When to Use Each Mode**

#### **Use `shouldDebounce={false}` (default) when:**

- ✅ You want consistent, predictable intervals
- ✅ Multiple timers completing shouldn't affect the snooze rhythm
- ✅ You want the alarm to sound at regular intervals regardless of new completions

**Example use case**: Kitchen timer scenario - you want reminders every 30 seconds regardless of how many items finish cooking.

#### **Use `shouldDebounce={true}` when:**

- ✅ You want to "snooze" the alarm each time a new timer completes
- ✅ New completions should give you more time before the next alarm
- ✅ You want a "last activity" countdown

**Example use case**: Notification system - each new notification resets the "check notifications" reminder.

## ⚙️ Configuration

Controlled by constants in `config/app.ts`:

```typescript
export const SNOOZE_INTERVAL_MS = 30000; // 30 seconds per cycle
export const POLLING_INTERVAL_MS = 100;  // Update UI every 100ms
```

## 🎨 Visual Display

Shows:
- 🔄 **Timer icon** (reset/repeat symbol)
- ⏱️ **Countdown** formatted as `MM:SS` (e.g., "00:29", "00:15")

## 🧪 Testing

To test the SnoozeTimer:

1. **Start a timer** (any duration)
2. **Wait for completion** (status changes to 'completed')
3. **Verify SnoozeTimer appears** and starts counting down
4. **Watch it reset** when it reaches 0
5. **Clear completed timers** (click "Clear Completed" button)
6. **Verify SnoozeTimer disappears**

## 🔍 Troubleshooting

**Problem**: SnoozeTimer doesn't appear when timer completes

**Solution**: Check that:
- `TimersProvider` is wrapping the component
- Timer status is actually 'completed'
- `SNOOZE_INTERVAL_MS` is a positive number

**Problem**: Timer doesn't repeat

**Solution**: Check that:
- Modulo calculation is correct
- `startTime` is not being reset
- `hasCompletedTimers` remains true

## 📝 Notes

- Uses `useTimersOptional` instead of `useTimers` for safety (won't crash if provider is missing)
- Removed `sessionStorage` dependency for cleaner state management
- Auto-cleanup on unmount (clears interval)
- Efficient updates (only polls every `POLLING_INTERVAL_MS`)

