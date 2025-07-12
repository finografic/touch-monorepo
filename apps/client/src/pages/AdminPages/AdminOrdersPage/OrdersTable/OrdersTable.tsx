import React from 'react';
import { Button, Flex, Table, Text } from '@radix-ui/themes';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import { EditIcon, TrashIcon } from 'styles/icons';
import { styles } from './OrdersTable.styles';
import { getHumanReadableId } from 'utils/readable.utils';
import { useContent } from 'providers/ContentProvider';
import { ReadableSalt } from 'constants/readable-salt.constants';
import { formatUnixTimestamp } from 'utils/date.utils';

interface OrdersTableProps {
  orders: OrderReadableModel[];
  emptyMessage?: string;
  emptySubMessage?: string;
  onClickEdit: (orderId: string) => void;
  onClickDelete: (orderId: string) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  emptyMessage = 'No orders found',
  emptySubMessage = 'Try adjusting your search term',
  onClickEdit,
  onClickDelete,
}) => {
  const { currentLanguage } = useContent();

  return (
    <section css={styles} className="admin-content-page">
      <>
        {/* Results Table */}
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell className="th">Order ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="th">Drink Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="th">Subtype</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="th">Volume</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="th">Container</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="th">Temperature</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="th">Created</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="th th-action action-edit"></Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="th th-action action-delete"></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {orders.map((order) => (
              <Table.Row key={order.id}>
                <Table.Cell className="td td-order-id">
                  <Text size="2" weight="medium">
                    {getHumanReadableId<ReadableSalt>(order.id, currentLanguage, ReadableSalt.Order)}
                  </Text>
                  <Text size="1" color="gray">
                    {order.id}
                  </Text>
                </Table.Cell>
                <Table.Cell className="td">{order.drinkType || '-'}</Table.Cell>
                <Table.Cell className="td">{order.drinkSubtype || '-'}</Table.Cell>
                <Table.Cell className="td">{order.volume || '-'}</Table.Cell>
                <Table.Cell className="td">{order.containerType || '-'}</Table.Cell>
                <Table.Cell className="td">
                  {order.defaultTempConsume ? `${order.defaultTempConsume}°C` : '-'}
                </Table.Cell>
                <Table.Cell className="td">
                  <Text size="1">{formatUnixTimestamp(order.createdAt, currentLanguage)}</Text>
                </Table.Cell>
                <Table.Cell className="td td-action">
                  <Button
                    className="btn btn-edit"
                    onClick={() => onClickEdit(order.id)}
                    variant="ghost"
                    size="2"
                  >
                    <EditIcon className="icon-edit" />
                  </Button>
                </Table.Cell>
                <Table.Cell className="td td-action">
                  <Button
                    className="btn btn-delete"
                    onClick={() => onClickDelete(order.id)}
                    variant="ghost"
                    size="2"
                    color="red"
                  >
                    <TrashIcon className="icon-delete" />
                  </Button>
                </Table.Cell>
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
      </>
    </section>
  );
};
