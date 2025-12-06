import React, { useState } from 'react';
import { Button as RadixButton, Text } from '@radix-ui/themes';
import { useTableHeaders } from 'admin/hooks/useTableHeaders';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import type { ColumnProps } from 'primereact/column';
import type { DataTableFilterMeta, DataTableProps } from 'primereact/datatable';
import { DataTable } from 'primereact/datatable';
import { useAppConfig } from 'providers/AppConfigProvider';
import type { OrderReadableWithIndex } from '../hooks/useOrdersFilter';
import { useTableLabelMappings } from './useTableLabelMappings';
import { EditIcon, TrashIcon } from 'styles/icons';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import {
  ORDERS_TABLE_COLUMNS,
  PAGINATOR_NUM_ENTRIES,
  type OrdersTableColumnBodyType,
} from './OrdersTable.config';
import { styles } from './OrdersTable.styles';

// ============================================================================
// Constants
// ============================================================================

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
  const { getHeader } = useTableHeaders();

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

  const bodyRenderers: Record<OrdersTableColumnBodyType, ColumnProps['body']> = {
    index: indexBodyTemplate,
    mode: modeBodyTemplate,
    drinkType: drinkTypeBodyTemplate,
    drinkSubtype: drinkSubtypeBodyTemplate,
    volume: volumeBodyTemplate,
    containerType: containerTypeBodyTemplate,
    temperature: temperatureBodyTemplate,
    actions: actionsBodyTemplate,
  };

  return (
    <section css={styles} className="table-container">
      <DataTable
        value={orders}
        dataKey="id"
        selectionMode="multiple"
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
        {ORDERS_TABLE_COLUMNS.map((column) => (
          <Column
            key={column.field}
            field={column.field === 'actions' ? undefined : column.field}
            header={getHeader(column.field)}
            sortable={column.sortable !== undefined ? column.sortable : true}
            filter={column.filter !== undefined ? column.filter : true}
            filterPlaceholder={column.filterPlaceholder ?? 'Search'}
            style={column.style ?? { minWidth: '100px', maxWidth: '120px' }}
            headerStyle={column.headerStyle}
            body={bodyRenderers[column.bodyType]}
          />
        ))}
      </DataTable>
    </section>
  );
};
