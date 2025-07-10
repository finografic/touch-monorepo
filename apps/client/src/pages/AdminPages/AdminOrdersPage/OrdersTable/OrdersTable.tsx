import React from 'react';
import { Button, Flex, Table, Text } from '@radix-ui/themes';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import { EditIcon } from 'styles/icons';
import { styles } from './OrdersTable.styles';
import clsx from 'clsx';

interface OrdersTableProps {
  orders: OrderReadableModel[];
  emptyMessage?: string;
  emptySubMessage?: string;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  emptyMessage = 'No orders found',
  emptySubMessage = 'Try adjusting your search term',
}) => {
  return (
    <section css={styles} className="admin-content-page">
      <>
        {/* Results Table */}
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Order ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Drink Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Subtype</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Volume</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Container</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Temperature</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="th-action"></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {orders.map((order) => (
              <Table.Row key={order.id}>
                <Table.Cell>
                  <Text size="1">{order.id.slice(0, 8)}...</Text>
                </Table.Cell>
                <Table.Cell>{order.drinkType || '-'}</Table.Cell>
                <Table.Cell>{order.drinkSubtype || '-'}</Table.Cell>
                <Table.Cell>{order.volume || '-'}</Table.Cell>
                <Table.Cell>{order.containerType || '-'}</Table.Cell>
                <Table.Cell>{order.defaultTempConsume ? `${order.defaultTempConsume}°C` : '-'}</Table.Cell>
                <Table.Cell>
                  <Text size="1">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                  </Text>
                </Table.Cell>
                <Table.Cell className="td-action">
                  <Button className="icon-edit" onClick={() => ({})} variant="ghost">
                    <EditIcon />
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
