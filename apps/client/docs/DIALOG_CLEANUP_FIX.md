# Dialog Body Attributes Cleanup Fix

📅 Oct 24, 2025

## Problem

After closing Radix UI dialogs (specifically `AuthLoginDialog`), the following attributes were persisting on the `<body>` element:
- `style="pointer-events: none;"`
- `data-scroll-locked="1"`

This caused the entire page to be non-interactive after dialog close.

## Root Cause

**Navigation was interrupting Radix Dialog's cleanup process.**

In `AuthLoginDialog.tsx` line 46, the code was calling `navigate('/admin')` **immediately** after successful login:

```typescript
// ❌ PROBLEM: Navigate immediately
const handleLoginSuccess = () => {
  navigate('/admin'); // This interrupts Radix cleanup!
};
```

When you navigate during a dialog close, React Router unmounts the component before Radix Dialog can properly clean up the body attributes.

## Solution

### 1. Created Cleanup Utility (`utils/ui.utils.ts`)

```typescript
export const cleanupDialogBodyAttributes = (): void => {
  const body = document.body;

  // Remove inline pointer-events style
  if (body.style.pointerEvents === 'none') {
    body.style.pointerEvents = '';
  }

  // Remove data-scroll-locked attribute
  if (body.hasAttribute('data-scroll-locked')) {
    body.removeAttribute('data-scroll-locked');
  }

  // Also check for data-aria-hidden attribute
  if (body.hasAttribute('data-aria-hidden')) {
    body.removeAttribute('data-aria-hidden');
  }
};
```

### 2. Fixed Dialog Navigation (`AuthLoginDialog.tsx`)

```typescript
// ✅ SOLUTION: Navigate immediately, cleanup in separate effect
const handleLoginSuccess = () => {
  closeLoginDialog(); // Close dialog
  navigate('/admin'); // Navigate immediately (won't be lost)
};

const handleCloseDialog = useCallback(() => {
  closeLoginDialog();

  // If blocking access, navigate home
  if (isBlockingAccess) {
    navigate('/');
  }
}, [closeLoginDialog, isBlockingAccess, navigate]);

// 🧹 Cleanup when dialog closes (watches isLoginDialogOpen state)
useEffect(() => {
  if (!isLoginDialogOpen) {
    // Dialog just closed, schedule cleanup
    const timeoutId = setTimeout(() => {
      cleanupDialogBodyAttributes();
    }, 150); // Slightly longer to ensure Radix cleanup runs first

    return () => clearTimeout(timeoutId);
  }
}, [isLoginDialogOpen]);

// 🧹 Safety net: Always cleanup on component unmount
useEffect(() => {
  return () => {
    // If component unmounts while dialog was open, force cleanup
    cleanupDialogBodyAttributes();
  };
}, []);
```

## Why This Works (Better Approach)

### The Problem with setTimeout in Handlers

❌ **Bad**: If you put `setTimeout` with `navigate()` inside a handler, and the component unmounts before the timeout fires, the navigation could be lost.

### The Solution: Separate Concerns

✅ **Good**:
1. **Navigate immediately** in the handler - Navigation happens synchronously, guaranteed to execute
2. **Cleanup in useEffect** - Watches `isLoginDialogOpen` state, cleanup happens separately
3. **Safety net on unmount** - Even if component unmounts unexpectedly, cleanup still runs

### How It Works

1. `handleLoginSuccess()` calls `closeLoginDialog()` → sets `isLoginDialogOpen = false`
2. `navigate('/admin')` executes immediately → React Router navigates (guaranteed)
3. `useEffect` detects `isLoginDialogOpen` changed to `false` → schedules cleanup
4. Cleanup runs after 150ms → removes any lingering body attributes
5. If component unmounts early → cleanup useEffect still runs on unmount

## When to Use the Cleanup Utility

### Automatic (Already Fixed)

- `AuthLoginDialog` - Fixed with proper timing
- Other dialogs following the same pattern

### Manual Use Cases

If you have dialogs that navigate or do other async operations on close:

```typescript
import { cleanupDialogBodyAttributes } from 'utils/ui.utils';

// After closing a dialog with navigation
const handleClose = () => {
  closeDialog();
  setTimeout(() => {
    cleanupDialogBodyAttributes();
    // Do your navigation or other work
  }, 100);
};

// Or if you just want to force cleanup
useEffect(() => {
  return () => {
    cleanupDialogBodyAttributes(); // Cleanup on unmount
  };
}, []);
```

## Testing

1. **Open the login dialog** (click login button or navigate to protected route)
2. **Log in successfully**
3. **Check the body element** - Should NOT have:
   - `style="pointer-events: none;"`
   - `data-scroll-locked="1"`
4. **Test interaction** - Page should be fully interactive

## Related Files

- ✅ `utils/ui.utils.ts` - Cleanup utility
- ✅ `components/Dialog/dialogs/AuthLoginDialog/AuthLoginDialog.tsx` - Fixed
- 🔍 `components/Dialog/dialogs/AuthLoginDialogV2/AuthLoginDialogV2.tsx` - V2 (not currently used)

## Additional Notes

### Why 100ms?

Radix Dialog uses CSS transitions (typically 250ms) but most of the DOM cleanup happens immediately. 100ms is a safe buffer that:
- Allows Radix internal cleanup to complete
- Doesn't create noticeable delay for users
- Can be adjusted if needed (50-200ms range is safe)

### Alternative: Radix onCloseAutoFocus

You could also use Radix's built-in callback:

```typescript
<Dialog.Root
  open={isOpen}
  onOpenChange={onClose}
  onCloseAutoFocus={(e) => {
    cleanupDialogBodyAttributes();
    // Navigation here is safer
  }}
>
```

But the `setTimeout` approach is more universal and works even if the dialog unmounts suddenly.

