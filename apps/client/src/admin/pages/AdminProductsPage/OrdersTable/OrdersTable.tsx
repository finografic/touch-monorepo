import React, { useMemo } from 'react';
import type { DataTableClassNames, DataTableColumn } from '@workspace/design-system/components';
import { DataTable } from '@workspace/design-system/components';

import { button, checkbox, input, table as tableRecipe } from 'styled-system/recipes';

import { useAppConfig } from 'providers/AppConfigProvider';

import type { OrderReadableWithIndex } from '../hooks/useOrdersFilter';
import type { ColumnKey } from '../OrdersTableV1/OrdersTable';
import { createOrdersColumns } from '../OrdersTableV1/OrdersTable.columns';
import { useTableLabelMappings } from '../OrdersTableV1/useTableLabelMappings';

export interface ColumnSearchState {
  [key: string]: string;
}

export interface OrdersTableProps {
  orders: OrderReadableWithIndex[];
  emptyMessage?: string;
  onClickEdit: (orderId: string) => void;
  onClickDelete: (orderId: string) => void;
  onSelectionChange?: (selectedOrders: OrderReadableWithIndex[]) => void;
  selectedOrders?: OrderReadableWithIndex[];
}

const tableClassesRecipe = tableRecipe({ size: 'md', striped: true, stickyHeader: true });
const filterClassesRecipe = input({ size: 'sm' });
const paginationClassesRecipe = button({ size: 'xs', variant: 'ghost' });
const checkboxClassesRecipe = checkbox({ size: 'sm' });

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  emptyMessage = 'No orders found',
  onClickEdit,
  onClickDelete,
  onSelectionChange,
  selectedOrders,
}) => {
  const { currentLanguage } = useAppConfig();
  const { getLabel } = useTableLabelMappings(currentLanguage);

  const columns = useMemo<DataTableColumn<OrderReadableWithIndex>[]>(() => {
    return createOrdersColumns(getLabel, (field: string) => field as ColumnKey, {
      onClickEdit,
      onClickDelete,
    });
  }, [getLabel, onClickEdit, onClickDelete]);

  const classNames: DataTableClassNames = {
    table: {
      root: tableClassesRecipe.root,
      table: tableClassesRecipe.table,
      thead: tableClassesRecipe.thead,
      tbody: tableClassesRecipe.tbody,
      tfoot: tableClassesRecipe.tfoot,
      headerRow: tableClassesRecipe.headerRow,
      tr: tableClassesRecipe.tr,
      th: tableClassesRecipe.th,
      td: tableClassesRecipe.td,
      sortIcon: tableClassesRecipe.sortIcon,
      emptyState: tableClassesRecipe.emptyState,
      caption: tableClassesRecipe.caption,
    },
    filterInput: filterClassesRecipe,
    paginationButton: paginationClassesRecipe,
    checkbox: {
      root: checkboxClassesRecipe.root,
      control: checkboxClassesRecipe.control,
      indicator: checkboxClassesRecipe.indicator,
      label: checkboxClassesRecipe.label,
    },
  };

  return (
    <DataTable<OrderReadableWithIndex>
      data={orders}
      columns={columns}
      classNames={classNames}
      caption="Orders"
      emptyMessage={emptyMessage}
      pageSize={50}
      getRowId={(row) => row.id}
      selectedRows={selectedOrders}
      onSelectionChange={onSelectionChange}
    />
  );
};
