import type { ColumnDef } from './OrdersTable';

// Default column configuration - easily customizable!
export const DEFAULT_ORDERS_COLUMNS: ColumnDef[] = [
  { key: 'index', label: 'ID', width: '30px', maxWidth: '30px', searchable: false },
  { key: 'mode', label: 'Mode', width: '30px', maxWidth: '30px', searchable: true },
  { key: 'drinkType', label: 'Drink Type', width: '80px', maxWidth: '40px', searchable: true },
  { key: 'subtype', label: 'Subtype', width: '80px', maxWidth: '40px', searchable: true },
  { key: 'volume', label: 'Volume', width: '80px', maxWidth: '40px', searchable: true },
  { key: 'container', label: 'Container', width: '80px', maxWidth: '40px', searchable: true },
  { key: 'temperature', label: 'Temperature', width: '80px', maxWidth: '40px', searchable: true },
  { key: 'edit', label: '', width: '20px', maxWidth: '20px', searchable: false },
  { key: 'delete', label: '', width: '20px', maxWidth: '20px', searchable: false },
];

// Alternative configurations for different use cases
export const COMPACT_ORDERS_COLUMNS: ColumnDef[] = [
  { key: 'index', label: '#', width: '50px', searchable: false },
  { key: 'drinkType', label: 'Type', width: '100px', searchable: true },
  { key: 'volume', label: 'Vol', width: '60px', searchable: true },
  { key: 'temperature', label: 'Temp', width: '80px', searchable: true },
  { key: 'edit', label: '', className: 'th-action action-edit', width: '50px', searchable: false },
  { key: 'delete', label: '', className: 'th-action action-delete', width: '50px', searchable: false },
];

export const FULL_ORDERS_COLUMNS: ColumnDef[] = [
  { key: 'index', label: '#', width: '60px', searchable: false },
  { key: 'id', label: 'Order ID', width: '200px', searchable: true },
  { key: 'mode', label: 'Mode', width: '80px', searchable: true },
  { key: 'drinkType', label: 'Drink Type', width: '120px', searchable: true },
  { key: 'subtype', label: 'Subtype', width: '100px', searchable: true },
  { key: 'volume', label: 'Volume', width: '80px', searchable: true },
  { key: 'container', label: 'Container', width: '100px', searchable: true },
  { key: 'temperature', label: 'Temperature', width: '100px', searchable: true },
  { key: 'created', label: 'Created', width: '120px', searchable: false },
  { key: 'edit', label: '', className: 'th-action action-edit', width: '60px', searchable: false },
  { key: 'delete', label: '', className: 'th-action action-delete', width: '60px', searchable: false },
];
