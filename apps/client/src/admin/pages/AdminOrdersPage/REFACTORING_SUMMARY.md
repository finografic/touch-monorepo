# AdminOrdersPage Refactoring Summary

## Overview

Refactored the AdminOrdersPage to centralize data fetching and filtering logic, enabling dynamic title/subtitle updates based on page state and filter status.

## Changes Made

### 1. Created Custom Hook: `useOrdersFilter`

**Location:** `hooks/useOrdersFilter.ts`

**Purpose:** Encapsulates all filtering logic for orders (global search + column-specific filters)

**Returns:**
- `filteredOrders` - The filtered array of orders
- `isFiltered` - Boolean indicating if any filters are active
- `totalCount` - Total number of orders (before filtering)
- `filteredCount` - Number of orders after filtering

**Benefits:**
- Reusable across multiple components
- Single source of truth for filtering logic
- Easy to test in isolation
- Includes the `mode` filter fix (checks both `mode` and `modeId` properties)

### 2. Moved Data Fetching to Page Level

**Location:** `AdminOrdersPage.tsx`

**Before:**
- `useGetOrdersReadable()` was called inside `TabList`
- Filtering logic was inside `TabList`
- No way for parent to know about filter state

**After:**
- `useGetOrdersReadable()` called in `AdminOrdersPage`
- Filtering done at page level using `useOrdersFilter` hook
- Page has full visibility of data and filter state
- Filtered data passed down to `TabList` as props

### 3. Dynamic Title/Subtitle with useMemo

**Location:** `AdminOrdersPage.tsx` (lines 43-63)

**Implementation:**

```typescript
const { title, subtitle } = useMemo(() => {
  if (isEditMode) {
    return {
      title: 'Editar registro',
      subtitle: orderId || '',
    };
  }

  if (isNewMode) {
    return {
      title: 'Nuevo registro',
      subtitle: '',
    };
  }

  // List mode
  return {
    title: 'Gestión de configuraciones',
    subtitle: isFiltered ? `${filteredCount} results` : `${totalCount} entries`,
  };
}, [isEditMode, isNewMode, orderId, isFiltered, filteredCount, totalCount]);
```

**Behavior:**
- **Edit Mode:** Shows order ID as subtitle
- **New Mode:** No subtitle
- **List Mode (unfiltered):** Shows `"9 entries"` (total count)
- **List Mode (filtered):** Shows `"3 results"` (filtered count)

### 4. Refactored TabList Component

**Location:** `TabList.tsx`

**Changes:**
- Now receives data as props instead of fetching
- Removed filtering logic (now handled by parent)
- Simplified to focus on presentation and user interactions
- Still handles delete operations and navigation

**New Props:**

```typescript
interface TabListProps {
  orders: OrderReadableModel[];
  columnSearches: ColumnSearchState;
  onColumnSearchChange: React.Dispatch<React.SetStateAction<ColumnSearchState>>;
  isLoading: boolean;
  error: Error | null;
}
```

## Architecture Benefits

1. **Single Responsibility:** Each component/hook has a clear, focused purpose
2. **Better Performance:** `useMemo` ensures title/subtitle only recompute when dependencies change
3. **Improved Testability:** Filtering logic is isolated and can be tested independently
4. **Easier Maintenance:** Data flow is unidirectional (parent → child)
5. **Reusability:** `useOrdersFilter` can be used in other components if needed
6. **Real-time Updates:** Title/subtitle automatically update as filters change

## Data Flow

```
AdminOrdersPage
  ↓ (fetches data)
useGetOrdersReadable()
  ↓ (raw data)
useOrdersFilter(ordersData, columnSearches)
  ↓ (filtered data + metadata)
useMemo → title/subtitle
  ↓ (passes filtered data)
TabList
  ↓ (renders)
OrdersTable
```

## Future Enhancements (for Edit Mode)

As mentioned, the subtitle for edit mode can be enhanced to show additional context:
- Order details (e.g., "cerveza - rubia - 75cl - plastico")
- Creation/modification dates
- Status indicators
- Or any other relevant order metadata

This can easily be added by extending the `useMemo` logic in `AdminOrdersPage.tsx`.

