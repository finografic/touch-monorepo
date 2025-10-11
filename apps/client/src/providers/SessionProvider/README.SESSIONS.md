# Session Management System

## Overview

The Session Management System handles multiple concurrent user flows in the Servi Fresc application. It allows users to run multiple "Time" and "Product" flows simultaneously, each isolated by unique session IDs and slot assignments.

## Key Concepts

### 1. Session Lifecycle

- **Creation**: Sessions are created **only** when a flow is started (not on MainPage load)
- **Flow Types**: Two types of flows exist:
  - `PROGRAM_TIME`: Timer-based flows for time programming
  - `PROGRAM_PRODUCT`: Product configuration flows
- **Cancellation**: Sessions are removed when flows are canceled or completed
- **Multiple Sessions**: Multiple sessions can coexist, even of the same type

### 2. Session Structure

```typescript
interface ConfigurationSession {
  id: string;                    // Unique session identifier
  flowType: FlowTypeValue;       // 'program-time' | 'program-product'
  createdAt: string;             // ISO timestamp
  filters: OrderFilters;         // Session-specific filters (includes mode)
  slotNumbers: number[];         // Associated slot indexes
  isActive: boolean;             // Whether session is currently active
  isCurrent: boolean;            // Whether this is the current session
  isComplete: boolean;           // Whether session is completed
}
```

### 3. Slot Management

- **Slot Uniqueness**: Each slot can only belong to one active session at a time
- **Slot Indexes**: Sessions store slot indexes (not slot objects) for association
- **Available Slots**: Available slots are reduced as they're assigned to sessions
- **Slot Release**: Slots become available again when sessions are canceled

### 4. Filter Management

- **Global Filters**: `FiltersContext` holds the current filtering state (always active)
- **Session Filters**: Each session has its own `filters` object for isolation
- **Time Flows**: Have empty `filters: {}` - no product configuration needed
- **Product Flows**: Include `mode` filter and other product configuration filters
- **Filter Inheritance**: Only Product flows inherit filters from `FiltersContext`

## Implementation Details

### Session Creation

```typescript
// Time flows: No filters needed
const timeSessionId = createSession(FLOW_TYPES.PROGRAM_TIME);

// Product flows: Include current mode filter
const productSessionId = createSession(FLOW_TYPES.PROGRAM_PRODUCT, { mode: filters.mode });
```

### Session Context API

```typescript
// Core session management
createSession(flowType: FlowTypeValue, initialFilters?: OrderFilters): string
setActiveSession(sessionId: string): void
updateSessionFilters(sessionId: string, filters: OrderFilters): void
assignOrdersToSession(sessionId: string, slotNumbers: number[]): void
clearSession(sessionId: string): void
clearAllSessions(): void
```

**Note**: `initialFilters` parameter is optional and only used for Product flows. Time flows automatically get empty `filters: {}`.

### Data Flow

1. **MainPage**: Sets global `mode` filter in `FiltersContext`
2. **Time Flow Start**: Creates session with empty `filters: {}`
3. **Product Flow Start**: Creates session with current `mode` filter from `FiltersContext`
4. **Session Active**: Session filters are used for data filtering (Product flows only)
5. **Flow End**: Session is removed, slots become available

## Usage Examples

### Starting a Product Flow

```typescript
const { createSession, assignOrdersToSession } = useSession();
const { filters } = useFiltersContext();

// Create session with current mode filter
const sessionId = createSession(FLOW_TYPES.PROGRAM_PRODUCT, { mode: filters.mode });

// Assign selected slots to session
assignOrdersToSession(sessionId, selectedSlotNumbers);
```

### Starting a Time Flow

```typescript
const { createSession, assignOrdersToSession } = useSession();

// Create session without filters (Time flows don't need product configuration)
const sessionId = createSession(FLOW_TYPES.PROGRAM_TIME);

// Assign selected slots to session
assignOrdersToSession(sessionId, selectedSlotNumbers);
```

## Benefits

1. **Isolation**: Each flow operates independently with its own filters and slot assignments
2. **Concurrency**: Multiple flows can run simultaneously without conflicts
3. **Resource Management**: Slots are properly managed and released when flows end
4. **State Persistence**: Session state is maintained throughout the flow lifecycle
5. **Filter Consistency**: Mode filter is automatically inherited by new sessions

## Future Improvements

1. **Map Instead of POJO**: Consider using `Map<string, ConfigurationSession>` instead of `Record<string, ConfigurationSession>` for better performance
2. **Session Persistence**: Add session persistence across page refreshes
3. **Session History**: Track completed sessions for audit purposes
4. **Session Limits**: Implement maximum concurrent session limits if needed

## Related Files

- `SessionContext.ts`: Core session management logic
- `useButtonOperations.ts`: Session creation triggers
- `MainPage.tsx`: Global filter initialization
- `FiltersProvider/`: Global filter state management
