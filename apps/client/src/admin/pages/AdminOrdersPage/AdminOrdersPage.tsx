import React, { useEffect, useMemo, useState } from 'react';
import { Flex, Spinner, Text } from '@radix-ui/themes';
import { AdminContentLayout, AdminSection } from '../..';
import { useDeleteOrder, useGetOrderReadableById, useGetOrdersReadable } from 'queries/orders';
import { OrdersTable } from 'admin/pages/AdminOrdersPage/OrdersTable';
import { DEFAULT_ORDERS_COLUMNS } from 'admin/pages/AdminOrdersPage/OrdersTable/OrdersTable.columns';
import { OrdersForm } from 'admin/pages/AdminOrdersPage/OrdersForm';
import { useToast } from 'components/Toast';
import { Col, Container, Row } from 'react-grid-system';
import { styles } from './AdminOrdersPage.styles';
import { Drawer } from 'components/Drawer';
import { Title } from 'components/Title';
import { SearchBar } from 'components/SearchBar';
import { useNavigate, useParams } from 'react-router-dom';
import { getHumanReadableId } from 'utils/readable.utils';
import { useAppConfig } from 'providers/AppConfigProvider';
import clsx from 'clsx';

export const AdminOrdersPage: React.FC = () => {
  const { currentLanguage } = useAppConfig();
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

  // Delete order mutation
  const deleteOrderMutation = useDeleteOrder();

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
    modeId: string;
    drinkType: string;
    drinkSubtype?: string;
    volume: string;
    containerType: string;
    defaultTempConsume: number;
    defaultTempFreeze: number;
    timeRows: Array<{
      temperature?: number;
      timeA?: number;
      timeB?: number;
      timeC?: number;
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

  const handleDeleteOrder = async (orderId: string) => {
    // eslint-disable-next-line no-alert
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this order? This action cannot be undone.',
    );

    if (confirmDelete) {
      try {
        await deleteOrderMutation.mutateAsync(orderId);
        toast({
          variant: 'success',
          message: 'Order deleted successfully!',
          subText: `Order ${orderId} has been removed`,
        });
      } catch (error) {
        console.error('Failed to delete order:', error);
        toast({
          variant: 'error',
          message: 'Failed to delete order',
          subText: 'Please try again or contact support',
        });
      }
    }
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

  return (
    <section css={styles} className="admin-content-page">
      <AdminContentLayout
        title={isEditMode ? 'Edit Order' : 'Orders Management'}
        // detail={isEditMode ? HUMAN_READABLE_ORDER_ID : undefined}
        //  subtitle="Development orders for testing"
      >
        <header
          style={
            {
              //  width: '100%',
              // border: '2px solid red',
            }
          }
        >
          <Row justify="between" align="center">
            <Col xs={7}>
              <Title title={isEditMode ? 'Edit drink profile' : 'New drink profile'} />
            </Col>
            <Col xs={2}>
              <Title title="Drink profiles" />
            </Col>
            <Col xs={3}>
              {/* <Title title="Drink profiles" /> */}
              <Flex
                display="flex"
                justify="end"
                align="end"
                pt="5"
                // style={{ border: '2px solid blue' }}
              >
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  status={isDrawerOpen ? 'active' : 'inactive'}
                />
              </Flex>
            </Col>
          </Row>
        </header>
        <Row justify="between" align="center">
          <Col xs={7} className="col col-form">
            {/* <AdminSection
              className={clsx('admin-section', isEditMode ? 'mode-edit' : 'mode-new')}
              title="Formulario de datos"
            > */}
            <OrdersForm
              onSubmit={handleAddOrder}
              orderData={isEditMode ? orderData : undefined}
              isEditMode={isEditMode}
            />
            {/* </AdminSection> */}
          </Col>
          <Col xs={5} className="col col-table">
            <Flex justify="start" align="center" className="search-container" mb="6">
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

            <OrdersTable
              orders={filteredOrders}
              columns={DEFAULT_ORDERS_COLUMNS}
              emptyMessage="No orders found"
              emptySubMessage="Try adjusting your search term or add new orders"
              onClickEdit={handleEditOrder}
              onClickDelete={handleDeleteOrder}
            />
          </Col>
        </Row>
      </AdminContentLayout>
    </section>
  );
};
