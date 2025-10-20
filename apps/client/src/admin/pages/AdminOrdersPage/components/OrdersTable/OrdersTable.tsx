import React, { type CSSProperties, useMemo } from 'react';

import { Button, Flex, Table, Text } from '@radix-ui/themes';
import clsx from 'clsx';
import { useAppConfig } from 'providers/AppConfigProvider';

import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { SelectOption } from 'types/models/select-option.model';
import { formatUnixTimestamp } from 'utils/date.utils';

import type { OrderReadableWithIndex } from '../../hooks/useOrdersFilter';
import { ColumnFilter } from './ColumnSearchInput';
import { EditIcon, TrashIcon } from 'styles/icons';
import { styles } from './OrdersTable.styles';

// ============================================================================
// Column definition types
// ============================================================================

export type ColumnKey =
  | 'index'
  | 'id'
  | 'mode'
  | 'drinkType'
  | 'subtype'
  | 'volume'
  | 'container'
  | 'temperature'
  | 'created'
  | 'edit'
  | 'delete';

export interface ColumnDef {
  key: ColumnKey;
  label: string;
  width?: string;
  maxWidth?: string;
  className?: string;
  searchable?: boolean; // Whether this column should have a filter
  filterVariant?: 'search' | 'select'; // Type of filter: text search or select dropdown
  filterOptions?: SelectOption[]; // Options for select variant
  filterPlaceholder?: string; // Custom placeholder for filter
}

export interface ColumnSearchState {
  [key: string]: string; // Maps column key to search term
}

export interface OrdersTableProps {
  orders: OrderReadableWithIndex[];
  columns: ColumnDef[];
  emptyMessage?: string;
  emptySubMessage?: string;
  onClickEdit: (orderId: string) => void;
  onClickDelete: (orderId: string) => void;
  columnSearches?: ColumnSearchState;
  onColumnSearchChange?: (columnKey: ColumnKey, value: string) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  columns,
  emptyMessage = 'No orders found',
  emptySubMessage = 'Try adjusting your search term',
  onClickEdit,
  onClickDelete,
  columnSearches = {},
  onColumnSearchChange,
}) => {
  const { currentLanguage } = useAppConfig();

  // Render cell content based on column key
  const renderCellContent = (column: ColumnDef, order: OrderReadableWithIndex, index: number) => {
    switch (column.key) {
      case 'index':
        return (
          <Text size="2" weight="bold">
            {order.displayIndex}
          </Text>
        );

      case 'id':
        return (
          <div className="td-order-id">
            <Text size="2" weight="medium">
              {order.id}
            </Text>
          </div>
        );

      case 'mode':
        return order.mode || '-';

      case 'drinkType':
        return order.drinkType || '-';

      case 'subtype':
        return order.drinkSubtype || '-';

      case 'volume':
        return order.volume || '-';

      case 'container':
        return order.containerType || '-';

      case 'temperature':
        return order.defaultTempConsume ? `${order.defaultTempConsume}°C` : '-';

      case 'created':
        return <Text size="1">{formatUnixTimestamp(order.createdAt, currentLanguage)}</Text>;

      case 'edit':
        return (
          <Button
            className="button button-edit"
            onClick={() => onClickEdit(order.id)}
            variant="ghost"
            size="2"
          >
            <EditIcon className="icon-edit" />
          </Button>
        );

      case 'delete':
        return (
          <Button
            className="button button-delete"
            onClick={() => onClickDelete(order.id)}
            variant="ghost"
            size="2"
            color="red"
          >
            <TrashIcon className="icon-delete" />
          </Button>
        );

      default:
        return '-';
    }
  };

  const columnStyles = useMemo(() => {
    return columns.map((column) => {
      const styles = {} as CSSProperties;
      if (column.width) Object.assign(styles, { width: column.width });
      if (column.maxWidth) Object.assign(styles, { maxWidth: column.maxWidth });

      return styles;
    });
  }, [columns]);

  return (
    <section css={styles} className="admin-page-content table-container">
      {orders.length >= 0 ? (
        <Table.Root>
          <Table.Header style={{ width: '100%', position: 'fixed', display: 'table-header-group' }}>
            <Table.Row>
              {columns.map((column, i) => (
                <Table.ColumnHeaderCell
                  key={column.key}
                  className={clsx('th', `th-${column.key}`, column.className)}
                  style={
                    i === 0 ? { ...columnStyles[i], width: '20px', maxWidth: '20px' } : { ...columnStyles[i] }
                  }
                >
                  <Flex direction="column" gap="2">
                    <Text>{column.label}</Text>
                    {column.searchable && onColumnSearchChange && (
                      <>
                        {column.filterVariant === 'select' && column.filterOptions ? (
                          <ColumnFilter
                            variant="select"
                            value={columnSearches[column.key] || ''}
                            onChange={(value) => onColumnSearchChange(column.key, value)}
                            options={column.filterOptions}
                            placeholder=""
                          />
                        ) : (
                          <ColumnFilter
                            variant="search"
                            value={columnSearches[column.key] || ''}
                            onChange={(value) => onColumnSearchChange(column.key, value)}
                            placeholder=""
                            hasIcon={false}
                            width={`${Number(column.width.replace('px', '')) * 1.6}px`}
                          />
                        )}
                      </>
                    )}
                  </Flex>
                </Table.ColumnHeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body className="table-body">
            {orders.map((order, rowIndex) => (
              <Table.Row key={order.id}>
                {columns.map((column, i) => (
                  <Table.Cell
                    key={column.key}
                    className={clsx('td', `td-${column.key}`, column.className)}
                    style={
                      i === 0
                        ? {
                            ...columnStyles[i],
                            width: '20px',
                            maxWidth: '20px',
                            fontWeight: '900',
                          }
                        : { ...columnStyles[i] }
                    }
                  >
                    {renderCellContent(column, order, rowIndex)}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      ) : (
        <Flex direction="column" align="center" justify="center" py="8">
          <Text size="3" color="gray">
            {emptyMessage}
          </Text>
          <Text size="2" color="gray">
            {emptySubMessage}
          </Text>
        </Flex>
      )}
    </section>
  );
};
