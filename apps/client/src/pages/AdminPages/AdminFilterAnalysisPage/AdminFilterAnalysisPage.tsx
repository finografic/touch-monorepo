import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Flex, Spinner, Table, Text, TextField } from '@radix-ui/themes';
import { AdminContentLayout, AdminSection } from '../shared';
import { useGetOrdersReadable } from 'api/hooks/useOrdersReadable';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

export const AdminFilterAnalysisPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch orders-readable data
  const { data: ordersData = [], isLoading, error } = useGetOrdersReadable();

  // Simple search filtering
  const filteredOrders = useMemo(() => {
    let results = ordersData;

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(
        (order) =>
          order.drinkType?.toLowerCase().includes(searchLower) ||
          order.drinkSubtype?.toLowerCase().includes(searchLower) ||
          order.volume?.toLowerCase().includes(searchLower) ||
          order.containerType?.toLowerCase().includes(searchLower) ||
          order.temperatureProfile?.toLowerCase().includes(searchLower) ||
          order.id?.toLowerCase().includes(searchLower),
      );
    }

    return results.slice(0, 200); // Limit to 200 for performance
  }, [ordersData, searchTerm]);

  // Get summary statistics
  const summaryStats = useMemo(() => {
    const drinkTypes = new Set(ordersData.map((o) => o.drinkType)).size;
    const volumes = new Set(ordersData.map((o) => o.volume)).size;
    const containers = new Set(ordersData.map((o) => o.containerType)).size;

    return { drinkTypes, volumes, containers };
  }, [ordersData]);

  if (isLoading) {
    return (
      <AdminContentLayout
        title="Filter Analysis"
        subtitle="Analyze orders data and filtering behavior"
        isLoading={true}
      >
        <Flex direction="column" gap="4" align="center" justify="center" p="6">
          <Spinner size="3" />
          <Text>Loading orders data...</Text>
        </Flex>
      </AdminContentLayout>
    );
  }

  if (error) {
    return (
      <AdminContentLayout
        title="Filter Analysis"
        subtitle="Analyze orders data and filtering behavior"
        error={error.message}
      >
        <AdminSection>
          <Text color="red">Error loading orders: {error.message}</Text>
        </AdminSection>
      </AdminContentLayout>
    );
  }

  return (
    <AdminContentLayout title="Filter Analysis" subtitle="Analyze orders data and filtering behavior">
      {/* Summary Stats */}
      <AdminSection title="Data Summary">
        <Flex gap="4" wrap="wrap">
          <Card>
            <Flex direction="column" align="center" p="4">
              <Text size="6" weight="bold" color="blue">
                {ordersData.length}
              </Text>
              <Text size="2" color="gray">
                Total Orders
              </Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" p="4">
              <Text size="6" weight="bold" color="green">
                {filteredOrders.length}
              </Text>
              <Text size="2" color="gray">
                Filtered Results
              </Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" p="4">
              <Text size="6" weight="bold" color="orange">
                {summaryStats.drinkTypes}
              </Text>
              <Text size="2" color="gray">
                Drink Types
              </Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" p="4">
              <Text size="6" weight="bold" color="purple">
                {summaryStats.volumes}
              </Text>
              <Text size="2" color="gray">
                Volume Options
              </Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" p="4">
              <Text size="6" weight="bold" color="cyan">
                {summaryStats.containers}
              </Text>
              <Text size="2" color="gray">
                Container Types
              </Text>
            </Flex>
          </Card>
        </Flex>
      </AdminSection>

      {/* Search and Results */}
      <AdminSection title="Orders Data">
        <Flex justify="between" align="center" mb="4">
          <Flex align="center" gap="3">
            <TextField.Root
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="2"
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </Flex>

          <Text size="2" color="gray">
            Showing {filteredOrders.length} of {ordersData.length} orders
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
            {filteredOrders.map((order) => (
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
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <Flex direction="column" align="center" justify="center" py="8">
            <Text size="3" color="gray">
              No orders found
            </Text>
            <Text size="2" color="gray">
              Try adjusting your search term
            </Text>
          </Flex>
        )}
      </AdminSection>
    </AdminContentLayout>
  );
};
