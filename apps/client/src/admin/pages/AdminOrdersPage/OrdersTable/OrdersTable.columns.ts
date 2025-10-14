import type { ColumnDef } from './OrdersTable';

// Default column configuration - easily customizable!
export const DEFAULT_ORDERS_COLUMNS: ColumnDef[] = [
  { key: 'index', label: '#', width: '60px' },
  { key: 'drinkType', label: 'Drink Type', width: '120px' },
  { key: 'subtype', label: 'Subtype', width: '100px' },
  { key: 'volume', label: 'Volume', width: '80px' },
  { key: 'container', label: 'Container', width: '100px' },
  { key: 'temperature', label: 'Temperature', width: '100px' },
  { key: 'edit', label: '', className: 'th-action action-edit', width: '60px' },
  { key: 'delete', label: '', className: 'th-action action-delete', width: '60px' },
];

// Alternative configurations for different use cases
export const COMPACT_ORDERS_COLUMNS: ColumnDef[] = [
  { key: 'index', label: '#', width: '50px' },
  { key: 'drinkType', label: 'Type', width: '100px' },
  { key: 'volume', label: 'Vol', width: '60px' },
  { key: 'temperature', label: 'Temp', width: '80px' },
  { key: 'edit', label: '', className: 'th-action action-edit', width: '50px' },
  { key: 'delete', label: '', className: 'th-action action-delete', width: '50px' },
];

export const FULL_ORDERS_COLUMNS: ColumnDef[] = [
  { key: 'index', label: '#', width: '60px' },
  { key: 'id', label: 'Order ID', width: '200px' },
  { key: 'mode', label: 'Mode', width: '80px' },
  { key: 'drinkType', label: 'Drink Type', width: '120px' },
  { key: 'subtype', label: 'Subtype', width: '100px' },
  { key: 'volume', label: 'Volume', width: '80px' },
  { key: 'container', label: 'Container', width: '100px' },
  { key: 'temperature', label: 'Temperature', width: '100px' },
  { key: 'created', label: 'Created', width: '120px' },
  { key: 'edit', label: '', className: 'th-action action-edit', width: '60px' },
  { key: 'delete', label: '', className: 'th-action action-delete', width: '60px' },
];
