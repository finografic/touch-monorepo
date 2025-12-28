import type { CSSProperties } from 'react';
import type { ColumnKey } from './OrdersTable';

// ============================================================================
// Constants
// ============================================================================

export type OrdersTableColumnBodyType =
  | 'index'
  | 'mode'
  | 'drinkType'
  | 'drinkSubtype'
  | 'volume'
  | 'containerType'
  | 'temperature'
  | 'actions';

export interface OrdersTableColumnConfig {
  field: ColumnKey;
  header: string;
  sortable?: boolean;
  filter?: boolean;
  filterPlaceholder?: string;
  style?: CSSProperties;
  headerStyle?: CSSProperties;
  bodyType: OrdersTableColumnBodyType;
}

export const ORDERS_TABLE_COLUMNS: OrdersTableColumnConfig[] = [
  {
    field: 'displayIndex',
    header: '#',
    sortable: true,
    filter: true,
    filterPlaceholder: 'Search',
    style: { minWidth: '60px', maxWidth: '80px' },
    headerStyle: { width: '3rem' },
    bodyType: 'index',
  },
  {
    field: 'mode',
    header: 'Mode',
    sortable: true,
    filter: true,
    filterPlaceholder: 'Search',
    style: { minWidth: '80px', maxWidth: '100px' },
    bodyType: 'mode',
  },
  {
    field: 'drinkType',
    header: 'Drink Type',
    sortable: true,
    filter: true,
    filterPlaceholder: 'Search',
    style: { minWidth: '120px', maxWidth: '150px' },
    bodyType: 'drinkType',
  },
  {
    field: 'drinkSubtype',
    header: 'Subtype',
    sortable: true,
    filter: true,
    filterPlaceholder: 'Search',
    style: { minWidth: '120px', maxWidth: '150px' },
    bodyType: 'drinkSubtype',
  },
  {
    field: 'volume',
    header: 'Volume',
    sortable: true,
    filter: true,
    filterPlaceholder: 'Search',
    style: { minWidth: '100px', maxWidth: '120px' },
    bodyType: 'volume',
  },
  {
    field: 'containerType',
    header: 'Container',
    sortable: true,
    filter: true,
    filterPlaceholder: 'Search',
    style: { minWidth: '100px', maxWidth: '120px' },
    bodyType: 'containerType',
  },
  {
    field: 'defaultTempConsume',
    header: 'Temperature',
    sortable: true,
    filter: true,
    filterPlaceholder: 'Search',
    style: { minWidth: '120px', maxWidth: '140px' },
    bodyType: 'temperature',
  },
  {
    field: 'actions',
    header: 'Actions',
    sortable: false,
    filter: false,
    style: { minWidth: '140px', maxWidth: '180px' },
    bodyType: 'actions',
  },
];
