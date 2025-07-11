import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Spinner, Text } from '@radix-ui/themes';
import { AdminContentLayout, AdminSection } from '../shared';
import { useGetOrderReadableById, useGetOrdersReadable } from 'queries/orders';
import { OrdersTable } from 'pages/AdminPages/AdminOrdersPage/OrdersTable';
import { OrdersForm } from 'pages/AdminPages/AdminOrdersPage/OrdersForm';
import { useToast } from 'components/Toast';
import { Col, Row } from 'react-grid-system';
import { styles } from './AdminOrdersPage.styles';
import { Drawer } from 'components/Drawer';
import { SearchBar } from 'components/SearchBar';
import { useNavigate, useParams } from 'react-router-dom';
import { getHumanReadableId } from 'utils/readable.utils';
import { useContent } from 'providers/ContentProvider/ContentContext';
import { ReadableSalt } from 'constants/readable-salt.constants';
import clsx from 'clsx';

export const AdminOrdersPage: React.FC = () => {
  const { currentLanguage } = useContent();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId?: string }>();

  // Determine if we're in edit mode
  const isEditMode = Boolean(orderId);

  // Fetch orders-readable data for the table
  const { data: ordersData = [], isLoading, error } = useGetOrdersReadable();

  // Fetch individual order data when in edit mode
  const {
    data: orderData,
    isLoading: isOrderLoading,
    error: orderError,
  } = useGetOrderReadableById(orderId || '');

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

  // Handle form submission for both create and update modes
  const handleAddOrder = (formData: {
    mode: number;
    drinkType: string;
    drinkSubtype?: string;
    volume: string;
    containerType: string;
    defaultTempConsume: number;
    defaultTempFreeze: number;
    timeRows: Array<{
      temperature?: number;
      time_a?: number;
      time_b?: number;
      time_c?: number;
    }>;
  }) => {
    if (isEditMode) {
      // Success message for edit mode - API call is now handled in OrdersForm
      const subtypeText = formData.drinkSubtype ? ` (${formData.drinkSubtype})` : '';
      toast({
        variant: 'success',
        message: 'Order updated successfully!',
        subText: `${formData.drinkType}${subtypeText} ${formData.volume} in ${formData.containerType}`,
      });
      // Navigate back to orders list
      navigate('/admin/orders');
    } else {
      // TODO: Implement actual API call to create order
      // For now, just show success toast
      const subtypeText = formData.drinkSubtype ? ` (${formData.drinkSubtype})` : '';
      toast({
        variant: 'success',
        message: 'Order added successfully!',
        subText: `${formData.drinkType}${subtypeText} ${formData.volume} in ${formData.containerType}`,
      });
    }
  };

  const handleEditOrder = (orderId: string) => {
    console.log('Editing order:', orderId);
    navigate(`/admin/orders/${orderId}`);
  };

  useEffect(
    function initSearchBox() {
      if (!isDrawerOpen) {
        setSearchTerm('');
      }
    },
    [isDrawerOpen],
  );

  if (isLoading || (isEditMode && isOrderLoading)) {
    return (
      <AdminContentLayout
        title="Orders Management"
        // subtitle="Development orders for testing"
        isLoading={true}
      >
        <Flex direction="column" gap="4" align="center" justify="center" p="6">
          <Spinner size="3" />
          <Text>Loading {isEditMode ? 'order' : 'orders'} data...</Text>
        </Flex>
      </AdminContentLayout>
    );
  }

  if (error || (isEditMode && orderError)) {
    const errorMessage = error?.message || orderError?.message || 'Unknown error';
    return (
      <AdminContentLayout
        title="Orders Management"
        // subtitle="Development orders for testing"
        error={errorMessage}
      >
        <AdminSection>
          <Text color="red">
            Error loading {isEditMode ? 'order' : 'orders'}: {errorMessage}
          </Text>
        </AdminSection>
      </AdminContentLayout>
    );
  }

  const HUMAN_READABLE_ORDER_ID: string =
    isEditMode && orderId
      ? getHumanReadableId<ReadableSalt>(orderId, currentLanguage, ReadableSalt.Order)
      : `${ReadableSalt.Order} data`;

  return (
    <section css={styles} className="admin-content-page">
      <AdminContentLayout
        title={isEditMode ? 'Edit Order' : 'Orders Management'}
        detail={isEditMode ? HUMAN_READABLE_ORDER_ID : undefined}
        //  subtitle="Development orders for testing"
      >
        <Row className="form-section">
          <Col>
            {/* Add New Order Form */}
            <AdminSection
              className={clsx('admin-section', isEditMode ? 'mode-edit' : 'mode-new')}
              title={isEditMode ? HUMAN_READABLE_ORDER_ID : 'Formulario de datos'}
            >
              <OrdersForm
                onSubmit={handleAddOrder}
                orderData={isEditMode ? orderData : undefined}
                isEditMode={isEditMode}
                onNavigateBack={() => navigate('/admin/orders')}
              />
            </AdminSection>
          </Col>
        </Row>

        {/* Show the drawer and table in both list and edit modes */}
        <Drawer
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
                      <span
                        style={{
                          opacity: 0.5,
                          display: 'inline-block',
                          paddingLeft: '0.33rem',
                        }}
                      >
                        / {ordersData.length} total
                      </span>
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
            emptyMessage="No orders found"
            emptySubMessage="Try adjusting your search term or add new orders"
            onClickEdit={handleEditOrder}
          />
        </Drawer>
      </AdminContentLayout>
    </section>
  );
};
