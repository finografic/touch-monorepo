// Example: How to easily customize OrdersTable columns
// Just modify the column configuration - no need to touch the component!

import { COMPACT_ORDERS_COLUMNS, DEFAULT_ORDERS_COLUMNS, FULL_ORDERS_COLUMNS } from '../OrdersTable.columns';

// Example 1: Use the default configuration (what you requested)
const defaultConfig = DEFAULT_ORDERS_COLUMNS;
// Shows: #, drinkType, subtype, volume, container, temperature, edit, delete

// Example 2: Use compact configuration
const compactConfig = COMPACT_ORDERS_COLUMNS;
// Shows: #, drinkType, volume, temperature, edit, delete

// Example 3: Use full configuration
const fullConfig = FULL_ORDERS_COLUMNS;
// Shows: #, id, mode, drinkType, subtype, volume, container, temperature, created, edit, delete

// Example 4: Create your own custom configuration
const customConfig = [
  { key: 'index', label: '#', width: '50px' },
  { key: 'drinkType', label: 'Beverage', width: '120px' },
  { key: 'volume', label: 'Size', width: '80px' },
  { key: 'temperature', label: 'Temp', width: '80px' },
  { key: 'edit', label: '', className: 'th-action action-edit', width: '50px' },
];

// Example 5: Reorder columns easily
const reorderedConfig = [
  { key: 'temperature', label: 'Temperature', width: '100px' },
  { key: 'index', label: '#', width: '60px' },
  { key: 'drinkType', label: 'Drink Type', width: '120px' },
  { key: 'subtype', label: 'Subtype', width: '100px' },
  { key: 'volume', label: 'Volume', width: '80px' },
  { key: 'container', label: 'Container', width: '100px' },
  { key: 'edit', label: '', className: 'th-action action-edit', width: '60px' },
  { key: 'delete', label: '', className: 'th-action action-delete', width: '60px' },
];

export { compactConfig, customConfig, defaultConfig, fullConfig, reorderedConfig };
