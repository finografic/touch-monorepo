import React, { useMemo, useState } from 'react';
import { Flex, Spinner, Text } from '@radix-ui/themes';
import { AdminContentLayout, AdminSection } from '../shared';
import { useGetOrdersReadable } from 'api/hooks/useOrdersReadable';
import { OrdersTable } from 'components/OrdersTable';
import { OrdersForm } from 'pages/AdminPages/AdminOrdersPage/OrdersForm';
import { useToast } from 'components/Toast';
import { Col, Row } from 'react-grid-system';
import { styles } from './AdminOrdersPage.styles';
import { ListDrawer } from './ListDrawer/ListDrawer';
import { SearchBar } from 'components/SearchBar';

export const AdminOrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
      <AdminContentLayout
        title="Orders Management"
        // subtitle="Development orders for testing"
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
        title="Orders Management"
        // subtitle="Development orders for testing"
        error={error.message}
      >
        <AdminSection>
          <Text color="red">Error loading orders: {error.message}</Text>
        </AdminSection>
      </AdminContentLayout>
    );
  }

  return (
    <section css={styles}>
      <AdminContentLayout
        title="Orders Management"
        //  subtitle="Development orders for testing"
      >
        <Row className="form-section">
          <Col>
            {/* Add New Order Form */}
            <AdminSection title="Formulario de datos">
              <OrdersForm onSubmit={handleAddOrder} />
            </AdminSection>
          </Col>
        </Row>

        <ListDrawer
          onOpenChange={setIsDrawerOpen}
          drawerBarLeft={
            // eslint-disable-next-line style/jsx-wrap-multilines
            <Flex justify="start" align="center" className="search-container">
              <Flex px="4">
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  status={isDrawerOpen ? 'active' : 'inactive'}
                />
              </Flex>
              <Flex px="4" pl="2">
                <Text size="2" color="gray" weight="bold" style={{ opacity: isDrawerOpen ? 1 : 0.66 }}>
                  {isDrawerOpen ? (
                    <>
                      Showing {filteredOrders.length}
                      <span style={{ opacity: 0.66 }}> of {ordersData.length} total</span>
                    </>
                  ) : (
                    <>{ordersData.length} total</>
                  )}
                </Text>
              </Flex>
            </Flex>
          }
        >
          <OrdersTable
            orders={filteredOrders}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            totalCount={ordersData.length}
            emptyMessage="No orders found"
            emptySubMessage="Try adjusting your search term or add new orders"
          />
        </ListDrawer>
      </AdminContentLayout>
    </section>
  );
};
