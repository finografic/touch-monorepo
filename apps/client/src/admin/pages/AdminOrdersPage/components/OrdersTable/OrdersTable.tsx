import React, { useMemo, useState } from 'react';

import { Button as RadixButton, Text } from '@radix-ui/themes';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import type { DataTableFilterMeta, DataTableProps } from 'primereact/datatable';

import { useAppConfig } from 'providers/AppConfigProvider';

import { formatUnixTimestamp } from 'utils/date.utils';
import type { OrderReadableWithIndex } from '../../hooks/useOrdersFilter';
import { EditIcon, TrashIcon } from 'styles/icons';
import { styles } from './OrdersTable.styles';

import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';

// ============================================================================
// Constants
// ============================================================================

export const PAGINATOR_NUM_ENTRIES = 50;

export const PAGINATOR_PROPS = {
  paginator: true,
  rows: PAGINATOR_NUM_ENTRIES,
  paginatorTemplate:
    'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
  currentPageReportTemplate: 'Showing {first} to {last} of {totalRecords} entries',
  rowsPerPageOptions: [25, 50, 100],
} satisfies Partial<DataTableProps<any>>;

// ============================================================================
// Column definition types
// ============================================================================

export type ColumnKey =
  | 'displayIndex'
  | 'id'
  | 'mode'
  | 'drinkType'
  | 'drinkSubtype'
  | 'volume'
  | 'containerType'
  | 'defaultTempConsume'
  | 'createdAt'
  | 'actions';

export interface ColumnDef {
  field: string;
  header: string;
  sortable?: boolean;
  filter?: boolean;
  filterPlaceholder?: string;
  style?: React.CSSProperties;
  body?: (rowData: OrderReadableWithIndex) => React.ReactNode;
}

export interface ColumnSearchState {
  [key: string]: string; // Maps column key to search term
}

export interface OrdersTableProps {
  orders: OrderReadableWithIndex[];
  emptyMessage?: string;
  onClickEdit: (orderId: string) => void;
  onClickDelete: (orderId: string) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  emptyMessage = 'No orders found',
  onClickEdit,
  onClickDelete,
}) => {
  const { currentLanguage } = useAppConfig();

  // Initialize filters for PrimeReact DataTable
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    displayIndex: { value: null, matchMode: FilterMatchMode.CONTAINS },
    mode: { value: null, matchMode: FilterMatchMode.CONTAINS },
    drinkType: { value: null, matchMode: FilterMatchMode.CONTAINS },
    drinkSubtype: { value: null, matchMode: FilterMatchMode.CONTAINS },
    volume: { value: null, matchMode: FilterMatchMode.CONTAINS },
    containerType: { value: null, matchMode: FilterMatchMode.CONTAINS },
    defaultTempConsume: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  // ============================================================================
  // Body Templates (Custom Cell Renderers)
  // ============================================================================

  const indexBodyTemplate = (rowData: OrderReadableWithIndex) => {
    return (
      <Text size="2" weight="bold" style={{ opacity: 0.4 }}>
        {rowData.displayIndex}
      </Text>
    );
  };

  const temperatureBodyTemplate = (rowData: OrderReadableWithIndex) => {
    return rowData.defaultTempConsume ? `${rowData.defaultTempConsume}°C` : '-';
  };

  const createdBodyTemplate = (rowData: OrderReadableWithIndex) => {
    return <Text size="1">{formatUnixTimestamp(rowData.createdAt, currentLanguage)}</Text>;
  };

  const actionsBodyTemplate = (rowData: OrderReadableWithIndex) => {
    return (
      <div className="action-buttons">
        <RadixButton
          className="button button-edit"
          onClick={() => onClickEdit(rowData.id)}
          variant="ghost"
          size="4"
        >
          <EditIcon className="icon-edit" />
        </RadixButton>
        <RadixButton
          className="button button-delete"
          onClick={() => onClickDelete(rowData.id)}
          variant="ghost"
          size="4"
          color="red"
        >
          <TrashIcon className="icon-delete" />
        </RadixButton>
      </div>
    );
  };

  return (
    <section css={styles} className="admin-page-content table-container">
      <DataTable
        value={orders}
        dataKey="id"
        filters={filters}
        filterDisplay="row"
        emptyMessage={emptyMessage}
        className="orders-datatable"
        stripedRows
        removableSort
        {...PAGINATOR_PROPS}
      >
        <Column
          field="displayIndex"
          header="#"
          sortable
          filter
          filterPlaceholder="Search"
          style={{ minWidth: '60px', maxWidth: '80px' }}
          body={indexBodyTemplate}
        />
        <Column
          field="mode"
          header="Mode"
          sortable
          filter
          filterPlaceholder="Search"
          style={{ minWidth: '80px', maxWidth: '100px' }}
        />
        <Column
          field="drinkType"
          header="Drink Type"
          sortable
          filter
          filterPlaceholder="Search"
          style={{ minWidth: '120px', maxWidth: '150px' }}
        />
        <Column
          field="drinkSubtype"
          header="Subtype"
          sortable
          filter
          filterPlaceholder="Search"
          style={{ minWidth: '120px', maxWidth: '150px' }}
        />
        <Column
          field="volume"
          header="Volume"
          sortable
          filter
          filterPlaceholder="Search"
          style={{ minWidth: '100px', maxWidth: '120px' }}
        />
        <Column
          field="containerType"
          header="Container"
          sortable
          filter
          filterPlaceholder="Search"
          style={{ minWidth: '100px', maxWidth: '120px' }}
        />
        <Column
          field="defaultTempConsume"
          header="Temperature"
          sortable
          filter
          filterPlaceholder="Search"
          style={{ minWidth: '120px', maxWidth: '140px' }}
          body={temperatureBodyTemplate}
        />
        <Column
          field="createdAt"
          header="Created"
          sortable
          style={{ minWidth: '140px', maxWidth: '160px' }}
          body={createdBodyTemplate}
        />
        <Column
          header="Actions"
          style={{ minWidth: '140px', maxWidth: '180px' }}
          body={actionsBodyTemplate}
        />
      </DataTable>
    </section>
  );
};
