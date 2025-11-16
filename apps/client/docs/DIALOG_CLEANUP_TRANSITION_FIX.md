# 🔥 Critical Fix: Dialog Cleanup Must Track State Transitions

📅 Oct 24, 2025

## The Problem You Encountered

**Symptoms:**
- Dialog takes ~1 second to open
- Console warning: `'click' handler took 281ms` and `Forced reflow while executing JavaScript took 73ms`
- Body attributes fight between your cleanup and Radix's setup

## Root Cause

```typescript
// ❌ BAD: These effects cleanup at the WRONG times!

// Problem 1: Runs cleanup when isLoginDialogOpen changes to false
// BUT ALSO runs cleanup function when it changes to true!
useEffect(() => {
  if (!isLoginDialogOpen) {
    const timeoutId = setTimeout(() => {
      cleanupDialogBodyAttributes(); // Only runs when closed
    }, 150);
    return () => clearTimeout(timeoutId); // ⚠️ Runs on EVERY change
  }
}, [isLoginDialogOpen]);

// Problem 2: Cleanup runs on EVERY re-render, not just unmount!
useEffect(() => {
  return () => {
    cleanupDialogBodyAttributes(); // ⚠️ Removes attrs when opening too!
  };
}, []); // Empty deps = cleanup runs before every render after mount
```

### What Happens When Dialog Opens

```
Time    Event
------- ---------------------------------------------------------------
0ms     User clicks "Login"
        └─ isLoginDialogOpen changes: false → true

5ms     React re-renders
        └─ Effect cleanup runs: cleanupDialogBodyAttributes() 💥
        └─ Radix tries to set: pointer-events: none

10ms    Your cleanup removes what Radix just set 💥

15ms    Radix tries again...

...     Battle continues for ~280ms

281ms   Finally settles (console warning)
```

---

## ✅ The Fix: Track State Transitions

```typescript
// ✅ CORRECT: Only cleanup when transitioning from open → closed
const prevIsOpenRef = useRef(isLoginDialogOpen);

useEffect(() => {
  const wasOpen = prevIsOpenRef.current;
  const isNowClosed = wasOpen && !isLoginDialogOpen;

  // Only cleanup when dialog transitions from open → closed
  if (isNowClosed) {
    const timeoutId = setTimeout(() => {
      cleanupDialogBodyAttributes();
    }, 150);

    prevIsOpenRef.current = isLoginDialogOpen;
    return () => clearTimeout(timeoutId);
  }

  // Always update ref for next render
  prevIsOpenRef.current = isLoginDialogOpen;
}, [isLoginDialogOpen]);
```

### What Happens Now

```
Time    Event
------- ---------------------------------------------------------------
0ms     User clicks "Login"
        └─ isLoginDialogOpen changes: false → true

5ms     React re-renders
        └─ Effect runs: wasOpen=false, isNowClosed=false
        └─ No cleanup! Just updates ref
        └─ Radix sets: pointer-events: none ✅

10ms    Dialog opens smoothly ✅

------- User clicks "Close"

0ms     isLoginDialogOpen changes: true → false

5ms     React re-renders
        └─ Effect runs: wasOpen=true, isNowClosed=true ✅
        └─ Schedules cleanup in 150ms

155ms   cleanupDialogBodyAttributes() runs ✅
        └─ Body attributes cleaned up
```

---

## Key Differences

| Aspect | Bad (Always Cleanup) | Good (Track Transitions) |
|--------|---------------------|--------------------------|
| **Cleanup on open** | ❌ Yes (fights with Radix) | ✅ No |
| **Cleanup on close** | ✅ Yes | ✅ Yes |
| **Cleanup on re-render** | ❌ Yes (unnecessary) | ✅ No |
| **Dialog open time** | ~281ms (slow) | ~5ms (instant) |
| **Console warnings** | ❌ Yes | ✅ No |
| **Performance** | Poor (constant fighting) | Excellent (no conflicts) |

---

## Understanding useEffect Cleanup Timing

### Common Misconception

```typescript
// ❌ Many developers think this only runs on unmount
useEffect(() => {
  return () => {
    console.log('Only on unmount, right?'); // WRONG!
  };
}, []);
```

### Reality

**Effect cleanup runs:**
1. **Before the effect runs again** (when deps change)
2. **Before the component re-renders** (if effect needs to run)
3. **When the component unmounts**

So with empty deps `[]`, if the parent re-renders, React will:
1. Run your cleanup function
2. Run your effect function again

This means your "cleanup" runs **way more often than you think**!

---

## The Ref Pattern

Using a `ref` to track previous state is a **React pattern** for:
- Detecting transitions (prev vs current)
- Comparing values without triggering re-renders
- Implementing "did value change?" logic

```typescript
const prevValueRef = useRef(value);

useEffect(() => {
  const hasChanged = prevValueRef.current !== value;

  if (hasChanged) {
    // Only do something when value actually changed
  }

  prevValueRef.current = value; // Always update for next time
}, [value]);
```

---

## Testing Your Fix

### Before (Bad)

1. Open login dialog
2. Watch console: `'click' handler took 281ms` ⚠️
3. Notice lag before dialog appears

### After (Good)

1. Open login dialog
2. Console: clean ✅
3. Dialog appears instantly ✅

---

## Lessons Learned

1. **useEffect cleanup ≠ componentWillUnmount** - It runs more often!
2. **Track transitions, not just state** - Use refs to compare prev vs current
3. **Cleanup should be surgical** - Only when actually needed
4. **Radix needs time** - Don't fight with the library
5. **Console warnings are hints** - 281ms handlers are never normal

---

## Pattern to Remember

```typescript
// ✅ Safe cleanup pattern for open/close states
const prevIsOpenRef = useRef(isOpen);

useEffect(() => {
  // Detect the specific transition you care about
  const justClosed = prevIsOpenRef.current && !isOpen;
  const justOpened = !prevIsOpenRef.current && isOpen;

  if (justClosed) {
    // Cleanup logic here
  }

  if (justOpened) {
    // Setup logic here (if needed)
  }

  // Always update ref
  prevIsOpenRef.current = isOpen;
}, [isOpen]);
```

This pattern works for any open/close state: modals, drawers, dropdowns, tooltips, etc.

