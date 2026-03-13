import type { CheckboxFieldClassNames } from '../../forms/checkbox';
import type { DataTableColumn } from './data-table.column';

export interface DataTableTableClassNames {
  root?: string;
  table?: string;
  thead?: string;
  tbody?: string;
  tfoot?: string;
  headerRow?: string;
  tr?: string;
  th?: string;
  td?: string;
  sortIcon?: string;
  emptyState?: string;
  caption?: string;
}

export interface DataTableClassNames {
  table: DataTableTableClassNames;
  /**
   * Class name for the per-column filter input inside headers.
   * Typically from `inputRecipe({ size: 'sm' })`.
   */
  filterInput?: string;
  /**
   * Class name for pagination buttons.
   * Typically from `buttonRecipe({ size: 'xs', variant: 'ghost' })`.
   */
  paginationButton?: string;
  /**
   * Optional checkbox slot classNames, passed through to your own
   * selection column that composes `CheckboxField`.
   */
  checkbox?: CheckboxFieldClassNames;
}

export interface DataTableProps<TData> {
  data: TData[];
  columns: DataTableColumn<TData>[];
  classNames: DataTableClassNames;
  caption?: string;
  loading?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  getRowId?: (originalRow: TData, index: number, parent?: unknown) => string;
  /**
   * Controlled selection: when provided together with onSelectionChange,
   * DataTable will treat row selection as controlled by the parent.
   */
  selectedRows?: TData[];
  /**
   * Called whenever the selected rows change. When used together with
   * selectedRows, this enables fully controlled selection from the parent.
   */
  onSelectionChange?: (rows: TData[]) => void;
}

