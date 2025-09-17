# TemperaturePage Flow Documentation

## Overview

This document outlines the flow, methods, and API calls for the TemperaturePage component, which manages temperature configuration for orders in the Touch application.

## File Structure

```
apps/client/src/pages/TemperaturePage/
├── TemperaturePage.tsx          # Main component
├── TemperatureForm.tsx          # Form component with PadTemperature inputs
├── useTemperatureManagement.ts  # Custom hook for temperature logic
├── temperature.constants.ts     # Constants and descriptions
├── ClosestTemperatures.tsx     # Displays closest temperature profile
└── TemperaturePage.styles.ts    # Component styles
```

## Page Load Flow (Step by Step)

### 1. Component Initialization

- **File**: `TemperaturePage.tsx` (lines 30-35)
- **Action**: Component mounts and initializes state
- **State**: Sets default temperatures (initial: 25°C, final: 25°C)

### 2. Context & Provider Setup

- **File**: `TemperaturePage.tsx` (lines 36-37)
- **Action**: Retrieves orders and filtered data from context providers
- **Providers**: `useOrders()`, `useFiltering()`

### 3. API Calls Initiation

- **File**: `TemperaturePage.tsx` (lines 39-47)
- **Action**: Triggers two parallel API calls
- **APIs**:
  - `useGetMinMaxTemperatures()` - Gets temperature constraints
  - `useGetTemperatureProfiles()` - Gets available temperature profiles

### 4. Custom Hook Initialization

- **File**: `TemperaturePage.tsx` (lines 54-58)
- **Action**: Initializes `useTemperatureManagement` hook
- **Purpose**: Manages temperature state, initialization, and filter updates

### 5. Temperature Initialization

- **File**: `useTemperatureManagement.ts` (lines 108-118)
- **Action**: Sets initial temperature values based on available data and updates all filter systems
- **Available Data Sources**:
  - **`defaultTempConsume`**: Retrieved from `dataFiltered[0].defaultTempConsume`
    - **Origin**: Comes from the `useFiltering()` hook context
    - **Source**: Originally fetched from order data via API calls
    - **Purpose**: Represents the recommended consumption temperature for the current order
  - **`INITIAL_TEMP_DEFAULT`**: Hardcoded constant value of 25°C
    - **Origin**: Defined in `constants/temperature.config.ts`
    - **Purpose**: Fallback ambient temperature when no probe data is available
- **Logic**:
  - **Initial Temperature**: Always set to `INITIAL_TEMP_DEFAULT` (25°C)
  - **Final Temperature**: Uses `defaultTempConsume` if available, otherwise falls back to 8°C
  - **Fallback Chain**: `defaultTempConsume` → 8°C (hardcoded fallback)
- **Data Flow**: `useFiltering()` → `dataFiltered` → `defaultTempConsume` → Temperature initialization

### 6. Filter Updates

- **File**: `useTemperatureManagement.ts` (lines 45-95)
- **Action**: Updates multiple filter systems
- **Systems**: Order filters, session filters, global filters

### 7. UI Rendering

- **File**: `TemperaturePage.tsx` (lines 85-129)
- **Action**: Renders the temperature form and profile information

## Major Methods & Their Functions

### TemperaturePage.tsx

#### `handleChange(name: TemperatureKey, temp: Temperature)`

- **Purpose**: Handles temperature input changes from PadTemperature components
- **Logic**: Adjusts final temperature if initial temperature is reduced
- **Calls**: `updateTemperatures()` from custom hook

#### `useEffect(() => initializeTemperatures(setTemperatures), [initializeTemperatures])`

- **Purpose**: Initializes temperatures on component mount
- **Trigger**: Component mount and when `initializeTemperatures` changes

### useTemperatureManagement.ts

#### `initializeTemperatures(setTemperatures)`

- **Purpose**: Sets initial temperature values and updates all filter systems
- **Logic**: Prevents multiple initializations using `isInitializedRef`
- **Calls**: `updateFilters()` to sync all systems

#### `updateFilters(initial, final)`

- **Purpose**: Updates all filter systems when temperatures change
- **Systems Updated**:
  - Order filters (via `setOrdersFilter`)
  - Session filters (via `updateSessionFilters`)
  - Global filters (via `setFilter`)
  - Pagination state (via `setIsNextDisabled`)

#### `updateTemperatures(initial, final, setTemperatures)`

- **Purpose**: Updates local state and triggers filter updates
- **Flow**: Updates state → calls `updateFilters()`

### TemperatureForm.tsx

#### `PadTemperature` Components

- **Purpose**: Renders temperature input controls
- **Props**: Temperature values, change handlers, constraints, labels
- **Validation**: Enforces min/max constraints and step increments

## API Calls & Data Flow

### 1. `useGetMinMaxTemperatures()`

- **Purpose**: Retrieves temperature constraints from server
- **Returns**: `{ min, max }` temperature values
- **Usage**: Sets boundaries for temperature inputs
- **File**: `queries/temperature/useGetMinMaxTemperatures`

### 2. `useGetTemperatureProfiles()`

- **Purpose**: Fetches available temperature profiles for current order
- **Parameters**: `orderId` from first order in context
- **Returns**: Array of temperature profile objects
- **Usage**:
  - Finds closest matching profiles
  - Sets minimum profile temperature
  - Displays profile information

### 3. Data Processing

- **Profiles**: Used to find closest matching temperatures
- **Constraints**: Applied to input validation
- **Filters**: Updated across multiple systems

## State Management Flow

### Local State

```typescript
const [temperatures, setTemperatures] = useState<TemperatureState>({
  initial: INITIAL_TEMP_DEFAULT,  // 25°C
  final: INITIAL_TEMP_DEFAULT,    // 25°C
});
```

### Context State Updates

1. **Order Filters**: Updated via `setOrdersFilter`
2. **Session Filters**: Updated via `updateSessionFilters`
3. **Global Filters**: Updated via `setFilter`
4. **Pagination**: Updated via `setIsNextDisabled`

### Validation Logic

- **Initial Temperature**: Must be >= `minProfileTemp` and <= `maxInitialTemp`
- **Final Temperature**: Must be >= `minFinalTemp` and <= `initial - MIN_TEMP_DIFFERENCE`
- **Step Increment**: 0.5°C for both inputs

## Key Dependencies

### External Hooks

- `useOrders()` - Order management context
- `useFiltering()` - Global filter management
- `useSession()` - Session management
- `usePagination()` - Navigation state
- `useRouteConfig()` - Route configuration

### Constants

- `INITIAL_TEMP_DEFAULT`: 25°C
- `MIN_TEMP_DIFFERENCE`: 5°C
- `FINAL_TEMP_MIN`: Minimum final temperature
- `INITIAL_TEMP_MAX`: Maximum initial temperature

### Utilities

- `findClosestProfile()` - Finds closest temperature profile
- `PadTemperature` - Temperature input component
- `ClosestTemperatures` - Profile display component

## Error Handling

### Loading States

- Shows loading message while APIs are fetching
- Waits for both temperature constraints and profiles
- Prevents rendering until initialization is complete

### Error States

- Handles temperature profiles loading errors
- Gracefully falls back to default values
- Continues operation even if some data fails to load

## Performance Considerations

### Memoization

- `closestProfile` calculation is memoized
- `minProfileTemp` calculation is memoized
- `defaultTempConsume` extraction is memoized

### Callback Optimization

- All filter update functions are wrapped in `useCallback`
- Prevents unnecessary re-renders of child components

### Initialization Guard

- `isInitializedRef` prevents multiple initializations
- Ensures temperature setup happens only once per component lifecycle
