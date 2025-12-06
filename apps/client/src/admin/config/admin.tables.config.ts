import type { DataTableProps } from 'primereact/datatable';

export const PAGINATOR_NUM_ENTRIES = 50;

export const PAGINATOR_PROPS = {
  paginator: true,
  rows: PAGINATOR_NUM_ENTRIES,
  paginatorTemplate:
    'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
  currentPageReportTemplate: 'Showing {first} to {last} of {totalRecords} entries',
  // TODO: [DISABLED] rowsPerPageOptions: [25, 50, 100],
} satisfies Partial<DataTableProps<any>>;
