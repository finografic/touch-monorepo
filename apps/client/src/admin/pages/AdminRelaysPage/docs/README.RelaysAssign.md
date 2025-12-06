# Relay Assignment: `RelaysTable.tsx`

📅 Nov 6, 2025

## Overview

The `RelaysTable` component provides an interface for assigning relay numbers (1-16) to slot numbers (1-16) in a one-to-one relationship. Each slot can be assigned to at most one relay, and each relay can be assigned to at most one slot.

## Key Behaviors

### Unique Assignment Logic

- **One-to-One Mapping**: Each relay number (1-16) can only be assigned to a single slot at a time.
- **Automatic Reassignment**: When a relay number is assigned to a new slot, it is automatically unset from its previous slot.
- **Unset State**: Slots can have no relay assignment (`relayNumber: null`), which displays the placeholder "Please select..." in the dropdown.

### Example Flow

1. **Initial State**: Slot 1 → Relay 1, Slot 2 → Relay 2
2. **User Action**: Assign "Relay 2" to Slot 1
3. **Result**: Slot 1 → Relay 2, Slot 2 → Unset (null)

## Implementation Details

### Hook: `useBulkUpdateSlotConfigurations`

The component uses the `useBulkUpdateSlotConfigurations` hook from `queries/slot-configurations` to perform updates. This hook:

- Sends a single bulk update request containing **all** slot configurations (up to 16 slots)
- Ensures atomic updates (all or nothing)
- Automatically invalidates and refetches the slot configurations query on success
- Prevents race conditions that could occur with multiple individual patch requests

### State Management

#### Local State: `assignments`

- **Type**: `Record<number, number | undefined>`
- **Purpose**: Tracks relay assignments for slots 1-16
- **Synchronization**: Automatically syncs with the `configurations` prop via `useEffect` to ensure consistency with server data

#### State Synchronization

A `useEffect` hook watches the `configurations` prop and updates the local `assignments` state whenever it changes. This ensures:

- The unique assignment logic works correctly from the first user interaction
- The UI stays in sync with server data after bulk updates
- No stale state issues when React Query refetches data

### Update Mechanism

When a user changes a relay assignment:

1. **Calculate Changes**: The `handleSelectChange` callback updates the local `assignments` state:
   - If assigning a relay that's already assigned elsewhere, the previous slot is cleared
   - The new assignment is set for the current slot

2. **Build Full Configuration**: The `updateAllConfigurations` helper function:
   - Maps over **all** slot configurations (not just 1-16)
   - Updates `relayNumber` for slots that have changed assignments
   - Preserves existing `relayNumber` for slots not in the assignments map
   - Converts `undefined` to `null` for database storage

3. **Bulk Update**: Sends all configurations in a single request:

   ```typescript
   bulkUpdateMutation.mutate({
     configurations: updatedConfigs, // All slots, not just changed ones
   });
   ```

4. **Automatic Refetch**: React Query automatically refetches the slot configurations, triggering the `useEffect` to sync local state.

### Database Schema

The `slot_configurations` table includes:
- `slotNumber`: Integer (1-16)
- `slotType`: Enum ('A', 'B', 'C')
- `relayNumber`: Integer (1-16) or `NULL` (nullable)

## UI Components

- **Slot Button**: Displays slot number with color-coded border based on slot type (A/B/C) and relay state (ON/OFF)
- **SelectCustom Dropdown**: Shows relay options (1-16) or placeholder when unset
- **Relay Status**: Displays current ON/OFF state of each relay

## Props

```typescript
interface RelaysTableProps {
  configurations: RelayConfig[];  // All slot configurations from server
  onRelayToggle?: (slotNumber: number, newState: boolean) => void;
  isLoading?: boolean;
}
```

## Notes

- The component filters configurations to only display slots 1-16 (`NUM_RELAYS`)
- All slots are included in bulk updates
- The placeholder "Please select..." appears when `relayNumber` is `null` or `undefined`
