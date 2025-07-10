import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Spinner, Text } from '@radix-ui/themes';
import { AdminContentLayout, AdminSection } from '../shared';
import { useGetOrdersReadable } from 'api/hooks/useOrdersReadable';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import { OrdersSummaryCards } from 'components/OrdersSummaryCards';
import { OrdersTable } from 'components/OrdersTable';
import { OrdersForm } from 'pages/AdminPages/AdminOrdersPage/OrdersForm';
import { useToast } from 'components/Toast';
import { Col, Row } from 'react-grid-system';
import { styles } from './AdminOrdersPage.styles';
import { Drawer } from '../../../components/Drawer/Drawer';

export const AdminOrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isTableVisible, setIsTableVisible] = useState(false);
  const { toast } = useToast();

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

  // Handle form submission (temporary - just show toast for now)
  const handleAddOrder = (formData: {
    mode: number;
    drinkType: string;
    drinkSubtype?: string;
    volume: string;
    containerType: string;
  }) => {
    // TODO: Implement actual API call to create order
    // For now, just show success toast
    const subtypeText = formData.drinkSubtype ? ` (${formData.drinkSubtype})` : '';
    toast({
      variant: 'success',
      message: 'Order added successfully!',
      subText: `${formData.drinkType}${subtypeText} ${formData.volume} in ${formData.containerType}`,
    });
  };

  if (isLoading) {
    return (
      <AdminContentLayout title="Orders Management" isLoading={true}>
        <Flex direction="column" gap="4" align="center" justify="center" p="6">
          <Spinner size="3" />
          <Text>Loading orders data...</Text>
        </Flex>
      </AdminContentLayout>
    );
  }

  if (error) {
    return (
      <AdminContentLayout title="Orders Management" error={error.message}>
        <AdminSection>
          <Text color="red">Error loading orders: {error.message}</Text>
        </AdminSection>
      </AdminContentLayout>
    );
  }

  return (
    <section css={styles}>
      <AdminContentLayout title="Orders Management">
        <Row className="form-section">
          <Col>
            <AdminSection title="Formulario de datos">
              <OrdersForm onSubmit={handleAddOrder} />
            </AdminSection>
          </Col>
        </Row>

        <Drawer
          isOpen={isTableVisible}
          onOpenChange={setIsTableVisible}
          orders={filteredOrders}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalCount={ordersData.length}
        />
      </AdminContentLayout>
    </section>
  );
};
