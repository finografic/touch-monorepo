import type { ColumnDef } from '@tanstack/react-table';

import type { SelectOption } from 'types/models/select-option.model';

/**
 * Example column configurations demonstrating filter variants
 */

// Example options for select filters
const DRINK_TYPE_OPTIONS: SelectOption[] = [
  { value: 'cerveza', label: 'Cerveza', category: 'Bebidas' },
  { value: 'refresco', label: 'Refresco', category: 'Bebidas' },
  { value: 'agua', label: 'Agua', category: 'Bebidas' },
  { value: 'vino', label: 'Vino', category: 'Bebidas' },
];

const CONTAINER_OPTIONS: SelectOption[] = [
  { value: 'plastico', label: 'Plástico', category: 'Material' },
  { value: 'metal', label: 'Metal', category: 'Material' },
  { value: 'vidrio', label: 'Vidrio', category: 'Material' },
];

const VOLUME_OPTIONS: SelectOption[] = [
  { value: '75cl', label: '75cl', category: 'Volumen' },
  { value: '50cl', label: '50cl', category: 'Volumen' },
  { value: '1L', label: '1L', category: 'Volumen' },
  { value: '33cl', label: '33cl', category: 'Volumen' },
];

/**
 * Example 1: Columns with SELECT filters for drinkType and container
 * Uses searchable dropdown with predefined options
 */
export const COLUMNS_WITH_SELECT_FILTERS: ColumnDef[] = [
  { key: 'index', label: '#', width: '60px', searchable: false },
  {
    key: 'drinkType',
    label: 'Drink Type',
    width: '120px',
    searchable: true,
    filterVariant: 'select',
    filterOptions: DRINK_TYPE_OPTIONS,
    filterPlaceholder: 'Select drink type...',
  },
  {
    key: 'subtype',
    label: 'Subtype',
    width: '100px',
    searchable: true,
    filterVariant: 'search', // Free text search
    filterPlaceholder: 'Search subtype...',
  },
  {
    key: 'volume',
    label: 'Volume',
    width: '80px',
    searchable: true,
    filterVariant: 'select',
    filterOptions: VOLUME_OPTIONS,
    filterPlaceholder: 'Select volume...',
  },
  {
    key: 'container',
    label: 'Container',
    width: '100px',
    searchable: true,
    filterVariant: 'select',
    filterOptions: CONTAINER_OPTIONS,
    filterPlaceholder: 'Select container...',
  },
  {
    key: 'temperature',
    label: 'Temperature',
    width: '100px',
    searchable: true,
    filterVariant: 'search',
    filterPlaceholder: 'Search temp...',
  },
  { key: 'edit', label: '', className: 'th-action action-edit', width: '60px', searchable: false },
  { key: 'delete', label: '', className: 'th-action action-delete', width: '60px', searchable: false },
];

/**
 * Example 2: Mixed filters - some select, some search
 * This is a common pattern for tables with both categorical and free-form data
 */
export const COLUMNS_MIXED_FILTERS: ColumnDef[] = [
  { key: 'index', label: '#', width: '60px', searchable: false },
  {
    key: 'drinkType',
    label: 'Drink Type',
    width: '120px',
    searchable: true,
    filterVariant: 'select',
    filterOptions: DRINK_TYPE_OPTIONS,
  },
  {
    key: 'subtype',
    label: 'Subtype',
    width: '100px',
    searchable: true,
    filterVariant: 'search', // Free text for custom subtypes
  },
  {
    key: 'volume',
    label: 'Volume',
    width: '80px',
    searchable: true,
    filterVariant: 'search', // Free text to allow custom volumes
  },
  {
    key: 'container',
    label: 'Container',
    width: '100px',
    searchable: true,
    filterVariant: 'select',
    filterOptions: CONTAINER_OPTIONS,
  },
  {
    key: 'temperature',
    label: 'Temperature',
    width: '100px',
    searchable: true,
    filterVariant: 'search',
  },
  { key: 'edit', label: '', className: 'th-action action-edit', width: '60px', searchable: false },
  { key: 'delete', label: '', className: 'th-action action-delete', width: '60px', searchable: false },
];

/**
 * Helper function to generate options from existing orders data
 * Use this in TabList to dynamically populate select filters
 */
export const generateOptionsFromOrders = (orders: any[], field: keyof (typeof orders)[0]): SelectOption[] => {
  const uniqueValues = [...new Set(orders.map((order) => order[field]).filter(Boolean))];
  return uniqueValues.map((value) => ({
    value: String(value),
    label: String(value),
    category: 'From existing orders',
  }));
};
