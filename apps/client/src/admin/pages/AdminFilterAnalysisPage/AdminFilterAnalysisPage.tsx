import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Spinner, Text } from '@radix-ui/themes';
import { AdminContentLayout, AdminSection } from '../..';
import { useGetOrdersReadable } from 'queries/orders/useGetOrdersReadable';
import { OrdersSummaryCards } from 'components/OrdersSummaryCards';
import { OrdersTable } from 'src/admin/pages/AdminOrdersPage/OrdersTable';

export const AdminFilterAnalysisPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: ordersData = [], isLoading, error } = useGetOrdersReadable();

  const filteredOrders = useMemo(() => {
    let results = ordersData;

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
        <OrdersSummaryCards
          totalOrders={ordersData.length}
          filteredResults={filteredOrders.length}
          drinkTypes={summaryStats.drinkTypes}
          volumeOptions={summaryStats.volumes}
          containerTypes={summaryStats.containers}
        />
      </AdminSection>

      {/* Search and Results */}
      <AdminSection title="Orders Data">
        <OrdersTable
          orders={filteredOrders}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalCount={ordersData.length}
        />
      </AdminSection>
    </AdminContentLayout>
  );
};
