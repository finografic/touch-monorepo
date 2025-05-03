# Pad State Management

## Overview

The pad state management system handles UI interactions for selectable pads (radio/checkbox) while maintaining responsive feedback and consistent state. It uses a combination of optimistic updates for UI responsiveness and centralized state management for consistency.

## Key Components

### LayoutUiContext

Central state manager that:
- Maintains the source of truth for pad states
- Handles pad initialization with proper field identification
- Manages state updates across the system

```typescript
// Core state update function
updatePadState: (fieldKey: OrderFieldKey, updater: (pads: PadUI[]) => PadUI[]) => {
  const currentPads = get().pads;
  if (!currentPads?.length) return;

  const updatedPads = updater(currentPads);
  set({ pads: updatedPads });
}
```

### Pad Component

Individual pad component that:
- Handles user interactions
- Manages optimistic updates
- Syncs with global state

```typescript
// Key state management
const [isCheckedOptimistic, setIsCheckedOptimistic] = useState(pad.isChecked);

// Sync with actual state
useEffect(() => {
  setIsCheckedOptimistic(pad.isChecked);
}, [pad.isChecked]);

// Update handling
const handleClick = useCallback(() => {
  if (pad.disabled) return;

  // Optimistic update
  const newCheckedState = pad.type === 'radio' ? true : !isCheckedOptimistic;
  setIsCheckedOptimistic(newCheckedState);

  // Global state update
  updatePadState(fieldKey, (pads: PadUI[]) =>
    pad.type === 'radio'
      ? pads.map(p => ({ ...p, isChecked: p.id === pad.id }))
      : pads.map(p => (p.id === pad.id ? { ...p, isChecked: !p.isChecked } : p))
  );
}, [pad.disabled, pad.type, pad.id, isCheckedOptimistic, fieldKey, updatePadState]);
```

## State Flow

1. User clicks pad
2. Optimistic state updates immediately (UI feedback)
3. Global state update processes
4. State changes propagate to all components
5. Optimistic state syncs with actual state

## Key Implementation Details

### Pad Identification

- Uses `id` for unique pad identification
- Maintains consistency between local and global state
- Properly handles radio vs checkbox behavior

### State Types

```typescript
interface PadUI {
  id: string;          // Unique identifier
  index: number;       // Position in pad array
  label: string;       // Display text
  name: string;        // Field identifier (matches fieldKey)
  type: PadType;       // 'radio' | 'checkbox'
  isChecked: boolean;  // Current state
  metadata?: DataEntry; // Additional data
}
```

### Initialization

```typescript
// Proper pad initialization
const { pads, numPads } = parsePadsConfig({
  data,
  config: padsConfig,
  fieldKey  // Important for proper pad identification
});
```

## Debug Support

The system includes built-in debugging support:
- Visual state indicators in UI: `{label} - {isChecked} - {isCheckedOptimistic}`
- Console logging of state updates
- Clear state flow tracking

## Common Issues & Solutions

### State Sync Issues

If states become out of sync:
1. Check pad identification (id matching)
2. Verify optimistic update logic
3. Ensure proper state propagation

### Multiple Selection Issues

For checkbox-type pads:
- Verify type configuration
- Check state toggle logic
- Confirm state update propagation

## Best Practices

1. **State Updates**
   - Use optimistic updates for responsiveness
   - Maintain single source of truth
   - Handle both radio and checkbox behaviors distinctly

2. **Pad Configuration**
   - Always provide unique ids
   - Include proper field identification
   - Set appropriate pad types

3. **State Management**
   - Keep state updates atomic
   - Maintain proper state synchronization
   - Handle edge cases (disabled states, etc.)

## Testing Considerations

1. **State Changes**
   - Verify correct state updates
   - Check optimistic update behavior
   - Confirm state synchronization

2. **User Interactions**
   - Test radio button exclusivity
   - Verify checkbox toggle behavior
   - Check disabled state handling

3. **Edge Cases**
   - Handle empty pad arrays
   - Manage disabled state interactions
   - Process invalid state updates
