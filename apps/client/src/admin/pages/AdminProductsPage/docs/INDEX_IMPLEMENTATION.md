# Display Index Implementation

📅 Oct 20, 2025

## Overview

Added a stable, persistent display index (4-digit padded) to the orders table that remains consistent based on the original order of records in the database, not the filtered/table iteration index.

## Key Changes

### 1. Extended Order Type with Display Index

**File:** `hooks/useOrdersFilter.ts`

Created a new type that extends `OrderReadableModel`:

```typescript
export interface OrderReadableWithIndex extends OrderReadableModel {
  displayIndex: string; // e.g., "0001", "0042"
}
```

### 2. Index Mapping in useOrdersFilter Hook

**File:** `hooks/useOrdersFilter.ts`

The hook now:
- Creates a `Map<orderId, displayIndex>` based on the original `ordersData` order
- Adds `displayIndex` property to each filtered order
- Provides a `getOrderIndex(orderId)` helper function
- The index is stable - if you delete record 0003, the remaining records keep their original indices (0001, 0002, 0004) rather than renumbering

**Implementation:**

```typescript
// Create index map based on original data order
const orderIndexMap = useMemo(() => {
  const map = new Map<string, string>();
  ordersData.forEach((order, index) => {
    map.set(order.id, String(index + 1).padStart(4, '0'));
  });
  return map;
}, [ordersData]);

// Add displayIndex to each filtered order
return results.slice(0, maxResults).map((order) => ({
  ...order,
  displayIndex: orderIndexMap.get(order.id) || '0000',
}));
```

### 3. Updated OrdersTable Component

**File:** `components/OrdersTable/OrdersTable.tsx`

- Changed `orders` prop type from `OrderReadableModel[]` to `OrderReadableWithIndex[]`
- Updated `renderCellContent` to use `order.displayIndex` instead of calculating from iteration index
- The "Index" column now displays the persistent database-order index

**Before:**

```typescript
case 'index':
  return (
    <Text size="2" weight="bold">
      {String(index + 1).padStart(4, '0')}  // Table iteration index
    </Text>
  );
```

**After:**

```typescript
case 'index':
  return (
    <Text size="2" weight="bold">
      {order.displayIndex}  // Stable database-order index
    </Text>
  );
```

### 4. Edit Mode Subtitle Enhancement

**File:** `AdminOrdersPage.tsx`

The edit mode now displays the padded index instead of the full CUID:

**Before:**

```
Title: "Editar registro"
Subtitle: "cmgolacxs0003gu7np3xfq16r"
```

**After:**

```
Title: "Editar registro"
Subtitle: "0003"
```

**Implementation:**

```typescript
if (isEditMode && orderId) {
  const displayIndex = getOrderIndex(orderId);
  return {
    title: 'Editar registro',
    subtitle: displayIndex || orderId,  // Falls back to orderId if not found
  };
}
```

## Benefits

1. **Stable Indices:** Records maintain their index even when other records are deleted
2. **User-Friendly:** "0003" is much easier to read than "cmgolacxs0003gu7np3xfq16r"
3. **Consistent Display:** The same index is used in the table and edit page subtitle
4. **Performance:** Indices are computed once and memoized
5. **Future-Proof:** If you later add SQLite row numbers, you can easily swap the implementation

## Future Enhancement: SQLite Row Numbers

If you want to use SQLite's internal row counter instead of the JavaScript index, you can modify the backend query to include `ROW_NUMBER()`:

```sql
SELECT
  ROW_NUMBER() OVER (ORDER BY createdAt) as rowNum,
  *
FROM orders;
```

Then update `useOrdersFilter` to use `order.rowNum` instead of the JavaScript index.

## Data Flow

```
1. useGetOrdersReadable()
   ↓ (returns ordersData)
2. useOrdersFilter()
   ↓ (creates orderIndexMap from original order)
3. Each order gets `displayIndex` property
   ↓
4. OrdersTable displays order.displayIndex
   ↓
5. Edit mode uses getOrderIndex(orderId) for subtitle
```

