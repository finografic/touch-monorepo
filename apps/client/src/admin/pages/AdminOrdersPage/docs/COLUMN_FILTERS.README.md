# Column Filters for OrdersTable

📅 Oct 15, 2025

This document explains how to use the column filter system in the OrdersTable component.

## Overview

The OrdersTable supports two types of column filters:
- **Search Filter** (`variant: 'search'`): Free-text input with fuzzy search
- **Select Filter** (`variant: 'select'`): Searchable dropdown with predefined options

## Column Filter Variants

### 1. Search Filter (Default)

Free-text input that filters as you type. Best for:
- Custom values that vary widely (e.g., subtypes, custom temperatures)
- Numeric ranges
- Text that doesn't fit into predefined categories

```typescript
{
  key: 'subtype',
  label: 'Subtype',
  width: '100px',
  searchable: true,
  filterVariant: 'search',  // or omit (default)
  filterPlaceholder: 'Search subtype...',
}
```

### 2. Select Filter

Searchable dropdown with predefined options using your existing `SelectSearchable` component. Best for:
- Categorical data (e.g., drink types, container materials)
- Predefined values from database
- Fields where you want to ensure data consistency

```typescript
{
  key: 'drinkType',
  label: 'Drink Type',
  width: '120px',
  searchable: true,
  filterVariant: 'select',
  filterOptions: DRINK_TYPE_OPTIONS,
  filterPlaceholder: 'Select drink type...',
}
```

## Usage Examples

### Static Options

Define options upfront for known categorical data:

```typescript
import type { SelectOption } from 'types/models/select-option.model';

const CONTAINER_OPTIONS: SelectOption[] = [
  { value: 'plastico', label: 'Plástico', category: 'Material' },
  { value: 'metal', label: 'Metal', category: 'Material' },
  { value: 'vidrio', label: 'Vidrio', category: 'Material' },
];

export const MY_COLUMNS: ColumnDef[] = [
  {
    key: 'container',
    label: 'Container',
    searchable: true,
    filterVariant: 'select',
    filterOptions: CONTAINER_OPTIONS,
  },
];
```

### Dynamic Options from Orders Data

Generate options from existing orders (in TabList.tsx):

```typescript
import { useMemo } from 'react';
import type { SelectOption } from 'types/models/select-option.model';

export const TabList: React.FC = () => {
  const { data: ordersData = [] } = useGetOrdersReadable();

  // Generate dynamic options from actual order data
  const drinkTypeOptions = useMemo(() => {
    const uniqueTypes = [...new Set(ordersData.map(o => o.drinkType).filter(Boolean))];
    return uniqueTypes.map(type => ({
      value: type,
      label: type,
      category: 'From existing orders',
    }));
  }, [ordersData]);

  const volumeOptions = useMemo(() => {
    const uniqueVolumes = [...new Set(ordersData.map(o => o.volume).filter(Boolean))];
    return uniqueVolumes.map(vol => ({
      value: vol,
      label: vol,
      category: 'From existing orders',
    }));
  }, [ordersData]);

  // Create columns with dynamic options
  const columns: ColumnDef[] = useMemo(() => [
    { key: 'index', label: '#', searchable: false },
    {
      key: 'drinkType',
      label: 'Drink Type',
      searchable: true,
      filterVariant: 'select',
      filterOptions: drinkTypeOptions,
    },
    {
      key: 'volume',
      label: 'Volume',
      searchable: true,
      filterVariant: 'select',
      filterOptions: volumeOptions,
    },
    // ... other columns
  ], [drinkTypeOptions, volumeOptions]);

  return (
    <OrdersTable
      orders={filteredOrders}
      columns={columns}
      columnSearches={columnSearches}
      onColumnSearchChange={handleColumnSearchChange}
      // ... other props
    />
  );
};
```

### Using SelectOptionDto Helpers

Leverage existing helper methods from `select-option.model.ts`:

```typescript
import { SelectOptionDto } from 'types/models/select-option.model';

// From database entities
const drinkTypeOptions = SelectOptionDto.fromDrinkTypes(drinkTypes, currentLanguage);
const volumeOptions = SelectOptionDto.fromVolumes(volumes, currentLanguage);
const containerOptions = SelectOptionDto.fromContainerTypes(containerTypes, currentLanguage);

// From orders data with progressive filtering
const volumeOptions = SelectOptionDto.fromOrdersData(
  ordersData,
  'volume',
  { drinkType: selectedDrinkType } // Only show volumes for selected drink type
);

// Merge database and custom options
const allOptions = SelectOptionDto.mergeOptions(
  drinkTypeOptions,
  SelectOptionDto.fromCustomItems(['custom-type-1', 'custom-type-2'], 'Custom')
);
```

### Mixed Filters Configuration

Combine both filter types for optimal UX:

```typescript
export const DEFAULT_ORDERS_COLUMNS: ColumnDef[] = [
  { key: 'index', label: '#', searchable: false },

  // Select filter for categorical data
  {
    key: 'drinkType',
    label: 'Drink Type',
    searchable: true,
    filterVariant: 'select',
    filterOptions: DRINK_TYPE_OPTIONS,
    filterPlaceholder: 'Select type...',
  },

  // Search filter for free-form text
  {
    key: 'subtype',
    label: 'Subtype',
    searchable: true,
    filterVariant: 'search',
    filterPlaceholder: 'Search subtype...',
  },

  // Select filter for standardized volumes
  {
    key: 'volume',
    label: 'Volume',
    searchable: true,
    filterVariant: 'select',
    filterOptions: VOLUME_OPTIONS,
  },

  // Search filter for numeric values
  {
    key: 'temperature',
    label: 'Temperature',
    searchable: true,
    filterVariant: 'search',
    filterPlaceholder: 'Search temp...',
  },
];
```

## ColumnDef Interface

```typescript
export interface ColumnDef {
  key: ColumnKey;
  label: string;
  width?: string;
  className?: string;
  searchable?: boolean;              // Enable filtering for this column
  filterVariant?: 'search' | 'select'; // Filter type (default: 'search')
  filterOptions?: SelectOption[];    // Options for 'select' variant
  filterPlaceholder?: string;        // Custom placeholder text
}
```

## SelectSearchable Features

When using `filterVariant: 'select'`, you get all the features of your existing `SelectSearchable` component:

✅ **Fuzzy search with match-sorter**
- Intelligent ranking (CONTAINS threshold)
- Searches across value, label, description, category

✅ **Virtual scrolling**
- Sliding window (default: 10 items)
- Bidirectional scroll loading
- Performant with large option lists

✅ **Keyboard navigation**
- Arrow keys to navigate
- Enter to select
- Escape to close

✅ **Clear functionality**
- X button to clear selection
- Hover effects (grey → red)

✅ **Categories**
- Options grouped by category
- Visual organization in dropdown

## Best Practices

1. **Use `select` for:**
   - Categorical data (drink types, materials, statuses)
   - Predefined values from database
   - Fields where consistency matters

2. **Use `search` for:**
   - Free-form text (notes, descriptions)
   - Numeric ranges (temperatures, quantities)
   - Highly variable data (custom subtypes)

3. **Dynamic options:**
   - Generate from actual data for better UX
   - Update options when data changes
   - Use `useMemo` to prevent unnecessary recalculations

4. **Performance:**
   - Limit `windowSize` to 10-20 for select dropdowns
   - Use `useMemo` for option generation
   - Consider progressive filtering (narrow options based on other selections)

## Migration Guide

To add select filters to existing columns:

```diff
  {
    key: 'drinkType',
    label: 'Drink Type',
    searchable: true,
+   filterVariant: 'select',
+   filterOptions: DRINK_TYPE_OPTIONS,
+   filterPlaceholder: 'Select drink type...',
  }
```

## Troubleshooting

**Select dropdown not showing options:**
- Ensure `filterOptions` array is not empty
- Check that `filterVariant` is set to `'select'`
- Verify `SelectOption` objects have `value` and `label` properties

**Filter not working:**
- Confirm `searchable: true` is set
- Check `onColumnSearchChange` is passed to OrdersTable
- Verify filtering logic in TabList handles the column key

**TypeScript errors:**
- Discriminated union requires explicit `variant` check
- Use conditional rendering (see OrdersTable.tsx implementation)

