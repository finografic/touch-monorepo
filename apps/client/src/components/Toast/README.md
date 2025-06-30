# Toast System Implementation

A comprehensive Toast notification system built with Radix UI primitives and Emotion styling.

## Features

- ✅ 4 Toast variants: `success`, `error`, `warning`, `info`
- ✅ Default messages for quick usage: `toast({ variant: 'success' })`
- ✅ Custom messages and subtext support
- ✅ Action buttons with callbacks
- ✅ Auto-dismiss with configurable durations
- ✅ Manual dismiss functionality
- ✅ Swipe-to-dismiss support
- ✅ Icon system with default icons per variant
- ✅ Emotion-based styling using existing color scheme
- ✅ TypeScript support with full type safety
- ✅ Accessibility features built-in

## Files Created

```
src/components/Toast/
├── index.ts                           # Main exports
├── Toast.types.ts                     # TypeScript definitions
├── Toast.styles.ts                    # Emotion-based styling
├── ToastIcons.tsx                     # Default SVG icons
├── ToastContext.tsx                   # React context & provider
├── Toast.tsx                          # Main toast component
├── ToastContainer.tsx                 # Container & system components
├── Toast.integration.examples.tsx     # Integration examples
└── README.md                          # This documentation
```

## Quick Start

### 1. Add to Your Layout

```tsx
import { ToastProvider, ToastSystem } from 'components/Toast';

export const YourLayout = () => {
  return (
    <ToastProvider>
      <div className="layout">
        {/* Your existing layout content */}
        <main>
          <Outlet />
        </main>

        {/* Add Toast system */}
        <ToastSystem />
      </div>
    </ToastProvider>
  );
};
```

### 2. Use in Components

```tsx
import { useToast } from 'components/Toast';

export const YourComponent = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({ variant: 'success' }); // Uses default message
  };

  const handleError = () => {
    toast({
      variant: 'error',
      message: 'Save failed',
      subText: 'Please try again later',
      action: {
        label: 'Retry',
        onClick: handleSave
      }
    });
  };

  return (
    <div>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleError}>Trigger Error</button>
    </div>
  );
};
```

## API Reference

### `toast(config: ToastConfig)`

#### ToastConfig Interface

```tsx
interface ToastConfig {
  variant: 'success' | 'error' | 'warning' | 'info';
  message?: string;           // Optional, uses default if not provided
  subText?: string;           // Optional secondary text
  icon?: React.ComponentType<{ color: string }>; // Optional custom icon
  duration?: number;          // Optional, uses variant default
  action?: {                  // Optional action button
    label: string;
    onClick: () => void;
  };
}
```

#### Default Messages

- `success`: "Operation completed successfully"
- `error`: "An error occurred"
- `warning`: "Please review and try again"
- `info`: "Information updated"

#### Default Durations

- `success`: 4000ms (4 seconds)
- `error`: 6000ms (6 seconds)
- `warning`: 5000ms (5 seconds)
- `info`: 4000ms (4 seconds)

### `dismiss(id: string)`

Manually dismiss a specific toast by its ID.

### `dismissAll()`

Dismiss all currently displayed toasts.

## Usage Examples

### Basic Usage

```tsx
// Simple success with default message
toast({ variant: 'success' });

// Error with custom message
toast({
  variant: 'error',
  message: 'Custom error message'
});
```

### Advanced Usage

```tsx
// With subtext and action
toast({
  variant: 'warning',
  message: 'Unsaved changes detected',
  subText: 'Your changes will be lost if you navigate away',
  action: {
    label: 'Save Now',
    onClick: () => saveChanges()
  }
});

// Custom duration (0 = no auto-dismiss)
toast({
  variant: 'info',
  message: 'Processing...',
  duration: 0
});
```

### API Integration Pattern

```tsx
const saveData = async () => {
  try {
    toast({ variant: 'info', message: 'Saving...', duration: 0 });
    await api.save(data);
    toast({ variant: 'success', message: 'Saved successfully!' });
  } catch (error) {
    toast({
      variant: 'error',
      message: 'Save failed',
      subText: error.message,
      action: { label: 'Retry', onClick: saveData }
    });
  }
};
```

## Integration with Existing Layouts

### AdminLayout Integration

Add the ToastProvider wrapper and ToastSystem component to your AdminLayout:

```tsx
// apps/client/src/layout/AdminLayout.tsx
import { ToastProvider, ToastSystem } from 'components/Toast';

export const AdminLayout = () => {
  return (
    <ToastProvider>
      {/* Your existing admin layout */}
      <ToastSystem />
    </ToastProvider>
  );
};
```

### Main Layout Integration

Similarly for your main application layout:

```tsx
// apps/client/src/layout/Layout.tsx
import { ToastProvider, ToastSystem } from 'components/Toast';

export const Layout = () => {
  return (
    <ToastProvider>
      {/* Your existing main layout */}
      <ToastSystem />
    </ToastProvider>
  );
};
```

## Styling

The Toast system uses your existing color scheme from `styles/colors.styles.ts`:
- Uses `colors.success`, `colors.danger`, `colors.warning`, `colors.info` for variants
- Uses `colors.text`, `colors.grey`, `colors.background` for typography and backgrounds
- Fully responsive with proper animations and transitions

## Accessibility

- Built on Radix UI primitives with full accessibility support
- Keyboard navigation support
- Screen reader announcements
- Proper ARIA attributes
- Focus management

## Next Steps

1. **Remove Old Toast Implementations**: Replace existing toast systems with this new implementation
2. **Add to Layouts**: Integrate ToastProvider and ToastSystem into your AdminLayout and main Layout
3. **Update Components**: Replace existing toast calls with the new `useToast` hook
4. **Test Integration**: Verify all toast functionality works correctly
5. **Customize if Needed**: Modify styles or add new variants as required

## Dependencies

- `@radix-ui/react-toast`: Radix UI Toast primitives (already installed)
- `@emotion/react`: For styling (already installed)
- Existing project color system
