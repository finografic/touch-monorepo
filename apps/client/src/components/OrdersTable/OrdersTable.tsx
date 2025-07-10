import React from 'react';
import { Flex, Table, Text, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import { SearchBar } from 'components/SearchBar';

interface OrdersTableProps {
  orders: OrderReadableModel[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalCount: number;
  emptyMessage?: string;
  emptySubMessage?: string;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  searchTerm,
  onSearchChange,
  totalCount,
  emptyMessage = 'No orders found',
  emptySubMessage = 'Try adjusting your search term',
}) => {
  return (
    <>
      {/* Search and Results Info */}
      <Flex justify="between" align="center" mb="4">
        {/* <SearchBar isActionActive={false} onClickAction={() => {}}   /> */}
        {/* <Flex align="center" gap="3">
          <TextField.Root
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            size="2"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
        </Flex> */}

        <Text size="2" color="gray">
          Showing {orders.length} of {totalCount} orders
        </Text>
      </Flex>

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
                <Text size="1">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</Text>
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
  );
};
