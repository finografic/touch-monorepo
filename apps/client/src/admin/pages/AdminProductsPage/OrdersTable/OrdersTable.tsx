import React, { useMemo } from 'react';
import type { DataTableClassNames, DataTableColumn } from '@finografic/design-system/components';
import { DataTable } from '@finografic/design-system/components';

import { useTableHeaders } from 'admin/hooks/useTableHeaders';
import { button, input, table } from 'styled-system/recipes';

import { useAppConfig } from 'providers/AppConfigProvider';

import type { OrderReadableWithIndex } from '../hooks/useOrdersFilter';
import { createOrdersColumns } from './orders-table.columns';
import { useTableLabelMappings } from './useTableLabelMappings';

export interface OrdersTableProps {
  orders: OrderReadableWithIndex[];
  emptyMessage?: string;
  onClickEdit: (orderId: string) => void;
  onClickDelete: (orderId: string) => void;
  onSelectionChange?: (selectedOrders: OrderReadableWithIndex[]) => void;
  selectedOrders?: OrderReadableWithIndex[];
}

const cssTable = table({ size: 'md', striped: true, stickyHeader: true });
const cssFilter = input({ size: 'sm' });
const cssPagination = button({ size: 'xs', variant: 'ghost' });

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
  const { getHeader } = useTableHeaders();

  const columns = useMemo<DataTableColumn<OrderReadableWithIndex>[]>(() => {
    return createOrdersColumns(getLabel, getHeader, {
      onClickEdit,
      onClickDelete,
    });
  }, [getLabel, getHeader, onClickEdit, onClickDelete]);

  const classNames: DataTableClassNames = {
    table: {
      root: cssTable.root,
      table: cssTable.table,
      thead: cssTable.thead,
      tbody: cssTable.tbody,
      tfoot: cssTable.tfoot,
      headerRow: cssTable.headerRow,
      tr: cssTable.tr,
      th: cssTable.th,
      td: cssTable.td,
      sortIcon: cssTable.sortIcon,
      emptyState: cssTable.emptyState,
      caption: cssTable.caption,
    },
    filterInput: cssFilter,
    paginationButton: cssPagination,
  };

  return (
    <DataTable<OrderReadableWithIndex>
      data={orders}
      columns={columns}
      classNames={classNames}
      emptyMessage={emptyMessage}
      pageSize={50}
      getRowId={(row) => row.id}
      selectedRows={selectedOrders}
      onSelectionChange={onSelectionChange}
    />
  );
};
