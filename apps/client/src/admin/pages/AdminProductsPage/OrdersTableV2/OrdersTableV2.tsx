import React, { useMemo } from 'react';

import type {
  DataTableClassNames,
  DataTableColumn,
} from '@workspace/design-system/components';
import { DataTable } from '@workspace/design-system/components';
import { table as tableRecipe, input, button, checkbox } from 'styled-system/recipes';

import { useAppConfig } from 'providers/AppConfigProvider';

import type { OrderReadableWithIndex } from '../hooks/useOrdersFilter';
import { createOrdersColumns } from '../OrdersTable/OrdersTable.columns';
import { useTableLabelMappings } from '../OrdersTable/useTableLabelMappings';

import type { ColumnKey } from '../OrdersTable/OrdersTable';

export interface ColumnSearchState {
  [key: string]: string;
}

export interface OrdersTableV2Props {
  orders: OrderReadableWithIndex[];
  emptyMessage?: string;
  onClickEdit: (orderId: string) => void;
  onClickDelete: (orderId: string) => void;
  onSelectionChange?: (selectedOrders: OrderReadableWithIndex[]) => void;
  selectedOrders?: OrderReadableWithIndex[];
}

const tableClassesRecipe = tableRecipe({ size: 'sm', striped: true, stickyHeader: true });
const filterClassesRecipe = input({ size: 'sm' });
const paginationClassesRecipe = button({ size: 'xs', variant: 'ghost' });
const checkboxClassesRecipe = checkbox({ size: 'sm' });

export const OrdersTableV2: React.FC<OrdersTableV2Props> = ({
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

