import React, { useMemo, useState } from 'react';

import { Button as RadixButton, Text } from '@radix-ui/themes';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import type { DataTableFilterMeta, DataTableProps } from 'primereact/datatable';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';

import { useAppConfig } from 'providers/AppConfigProvider';

import { formatUnixTimestamp } from 'utils/date.utils';
import type { OrderReadableWithIndex } from '../hooks/useOrdersFilter';
import { useTableLabelMappings } from './useTableLabelMappings';
import { EditIcon, TrashIcon } from 'styles/icons';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import { styles } from './OrdersTable.styles';

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
  // rowsPerPageOptions: [25, 50, 100],
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
  onSelectionChange?: (selectedOrders: OrderReadableWithIndex[]) => void;
  selectedOrders?: OrderReadableWithIndex[];
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  emptyMessage = 'No orders found',
  onClickEdit,
  onClickDelete,
  onSelectionChange,
  selectedOrders: externalSelectedOrders,
}) => {
  const { currentLanguage } = useAppConfig();
  const { getLabel } = useTableLabelMappings(currentLanguage);

  // Internal state for selection if not controlled externally
  const [internalSelectedOrders, setInternalSelectedOrders] = useState<OrderReadableWithIndex[]>([]);

  // Use external selection if provided, otherwise use internal state
  const selectedOrders = externalSelectedOrders ?? internalSelectedOrders;
  const setSelectedOrders = onSelectionChange
    ? (orders: OrderReadableWithIndex[]) => onSelectionChange(orders)
    : setInternalSelectedOrders;

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
      <Text size="2" weight="bold" className="td-index">
        {rowData.displayIndex}
      </Text>
    );
  };

  const COLUMNS: ColumnProps[] = [
    {
      field: 'displayIndex',
      header: '#',
      sortable: true,
      filter: true,
      filterPlaceholder: 'Search',
      style: { minWidth: '60px', maxWidth: '80px' },
      body: indexBodyTemplate,
      selectionMode: 'multiple',
      headerStyle: { width: '3rem' },
    },
    {
      field: 'mode',
      header: 'Mode',
      sortable: true,
      filter: true,
      filterPlaceholder: 'Search',
      style: { minWidth: '80px', maxWidth: '100px' },
      body: (rowData: OrderReadableWithIndex) => <Text size="2">{getLabel.mode(rowData.mode)}</Text>,
    },
    {
      field: 'drinkType',
      header: 'Drink Type',
      sortable: true,
      filter: true,
      filterPlaceholder: 'Search',
      style: { minWidth: '120px', maxWidth: '150px' },
      body: (rowData: OrderReadableWithIndex) => (
        <Text size="2">{getLabel.drinkType(rowData.drinkType)}</Text>
      ),
    },
    {
      field: 'drinkSubtype',
      header: 'Subtype',
      sortable: true,
      filter: true,
      filterPlaceholder: 'Search',
      style: { minWidth: '120px', maxWidth: '150px' },
      body: (rowData: OrderReadableWithIndex) => (
        <Text size="2">{getLabel.drinkSubtype(rowData.drinkSubtype)}</Text>
      ),
    },
    {
      field: 'volume',
      header: 'Volume',
      sortable: true,
      filter: true,
      filterPlaceholder: 'Search',
      style: { minWidth: '100px', maxWidth: '120px' },
      body: (rowData: OrderReadableWithIndex) => <Text size="2">{getLabel.volume(rowData.volume)}</Text>,
    },
    {
      field: 'containerType',
      header: 'Container',
      sortable: true,
      filter: true,
      filterPlaceholder: 'Search',
      style: { minWidth: '100px', maxWidth: '120px' },
      body: (rowData: OrderReadableWithIndex) => (
        <Text size="2">{getLabel.containerType(rowData.containerType)}</Text>
      ),
    },
  ];

  const modeBodyTemplate = (rowData: OrderReadableWithIndex) => {
    return <Text size="2">{getLabel.mode(rowData.mode)}</Text>;
  };

  const drinkTypeBodyTemplate = (rowData: OrderReadableWithIndex) => {
    return <Text size="2">{getLabel.drinkType(rowData.drinkType)}</Text>;
  };

  const drinkSubtypeBodyTemplate = (rowData: OrderReadableWithIndex) => {
    return <Text size="2">{getLabel.drinkSubtype(rowData.drinkSubtype)}</Text>;
  };

  const volumeBodyTemplate = (rowData: OrderReadableWithIndex) => {
    return <Text size="2">{getLabel.volume(rowData.volume)}</Text>;
  };

  const containerTypeBodyTemplate = (rowData: OrderReadableWithIndex) => {
    return <Text size="2">{getLabel.containerType(rowData.containerType)}</Text>;
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
    <section css={styles} className="table-container">
      <DataTable
        value={orders}
        dataKey="id"
        selection={selectedOrders}
        onSelectionChange={(e) => setSelectedOrders(e.value as OrderReadableWithIndex[])}
        filters={filters}
        filterDisplay="row"
        emptyMessage={emptyMessage}
        className="orders-datatable"
        stripedRows
        removableSort
        {...PAGINATOR_PROPS}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
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
          body={modeBodyTemplate}
        />
        <Column
          field="drinkType"
          header="Drink Type"
          sortable
          filter
          filterPlaceholder="Search"
          style={{ minWidth: '120px', maxWidth: '150px' }}
          body={drinkTypeBodyTemplate}
        />
        <Column
          field="drinkSubtype"
          header="Subtype"
          sortable
          filter
          filterPlaceholder="Search"
          style={{ minWidth: '120px', maxWidth: '150px' }}
          body={drinkSubtypeBodyTemplate}
        />
        <Column
          field="volume"
          header="Volume"
          sortable
          filter
          filterPlaceholder="Search"
          style={{ minWidth: '100px', maxWidth: '120px' }}
          body={volumeBodyTemplate}
        />
        <Column
          field="containerType"
          header="Container"
          sortable
          filter
          filterPlaceholder="Search"
          style={{ minWidth: '100px', maxWidth: '120px' }}
          body={containerTypeBodyTemplate}
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
        <Column header="Actions" body={actionsBodyTemplate} />
      </DataTable>
    </section>
  );
};
