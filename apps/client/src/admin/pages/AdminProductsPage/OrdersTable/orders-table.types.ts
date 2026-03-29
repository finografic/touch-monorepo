/** Keys of filterable / sortable columns — aligned with `useOrdersFilter` and column factory. */
export type ColumnKey =
  | 'displayIndex'
  | 'id'
  | 'mode'
  | 'drinkType'
  | 'drinkSubtype'
  | 'volume'
  | 'containerType'
  | 'defaultTempConsume'
  | 'actions';

export interface ColumnSearchState {
  [key: string]: string;
}
