import React from 'react';
import { Button, Flex, ScrollArea, Table, Text } from '@radix-ui/themes';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import { EditIcon, TrashIcon } from 'styles/icons';
import { styles } from './OrdersTable.styles';
import { useContent } from 'providers/ContentProvider';
import { useAppConfig } from 'providers/AppConfigProvider';
import { formatUnixTimestamp } from 'utils/date.utils';

// Column definition types
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
  className?: string;
}

export interface OrdersTableProps {
  orders: OrderReadableModel[];
  columns: ColumnDef[];
  emptyMessage?: string;
  emptySubMessage?: string;
  onClickEdit: (orderId: string) => void;
  onClickDelete: (orderId: string) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  columns,
  emptyMessage = 'No orders found',
  emptySubMessage = 'Try adjusting your search term',
  onClickEdit,
  onClickDelete,
}) => {
  const { currentLanguage } = useAppConfig();

  // Render cell content based on column key
  const renderCellContent = (column: ColumnDef, order: OrderReadableModel, index: number) => {
    switch (column.key) {
      case 'index':
        return (
          <Text size="2" weight="medium">
            {index + 1}
          </Text>
        );

      case 'id':
        return (
          <div className="td-order-id">
            <Text size="2" weight="medium">
              {order.id}
            </Text>
            <Text size="1" color="gray">
              {order.id}
            </Text>
          </div>
        );

      case 'mode':
        return order.modeId || '-';

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

  return (
    <section
      // css={styles}
      className="admin-content-page"
    >
      <>
        {/* Results Table */}
        {/* <ScrollArea
          id="scroll-area"
          type="always"
          scrollbars="vertical"
          //  style={{ height: 180 }}
        > */}
        <Table.Root>
          <Table.Header>
            <Table.Row>
              {columns.map((column) => (
                <Table.ColumnHeaderCell
                  key={column.key}
                  className={`th ${column.className || ''}`}
                  style={{ width: column.width }}
                >
                  {column.label}
                </Table.ColumnHeaderCell>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body className="table-body">
            {orders.map((order, index) => (
              <Table.Row key={order.id}>
                {columns.map((column) => (
                  <Table.Cell key={column.key} className={`td ${column.className || ''}`}>
                    {renderCellContent(column, order, index)}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {/* Empty State */}
        {orders.length === 0 && (
          <Flex direction="column" align="center" justify="center" py="8">
            <Text size="3" color="gray">
              {emptyMessage}
            </Text>
            <Text size="2" color="gray">
              {emptySubMessage}
            </Text>
          </Flex>
        )}
        {/* </ScrollArea> */}
      </>
    </section>
  );
};
