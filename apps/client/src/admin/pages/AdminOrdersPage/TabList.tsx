import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-grid-system';
import { useNavigate, useParams } from 'react-router-dom';

import { Flex, Spinner, Text } from '@radix-ui/themes';
import { OrdersForm } from 'admin/pages/AdminOrdersPage/OrdersForm';
import type { ColumnKey, ColumnSearchState } from 'admin/pages/AdminOrdersPage/OrdersTable';
import { OrdersTable } from 'admin/pages/AdminOrdersPage/OrdersTable';
import { DEFAULT_ORDERS_COLUMNS } from 'admin/pages/AdminOrdersPage/OrdersTable/OrdersTable.columns';
import clsx from 'clsx';

import { Drawer } from 'components/Drawer';
import { SearchBar } from 'components/SearchBar';
import { useToast } from 'components/Toast';
import { useAppConfig } from 'providers/AppConfigProvider';
import { useDeleteOrder, useGetOrderReadableById, useGetOrdersReadable } from 'queries/orders';
import { getHumanReadableId } from 'utils/readable.utils';
import { AdminContentLayout, AdminSection } from '../..';
import { styles } from './AdminOrdersPage.styles';

export const TabList: React.FC = () => {
  const { currentLanguage } = useAppConfig();
  const [searchTerm, setSearchTerm] = useState('');
  const [columnSearches, setColumnSearches] = useState<ColumnSearchState>({});
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

  // Column-specific search filtering
  const filteredOrders = useMemo(() => {
    let results = ordersData;

    // Apply global search (if still needed)
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

    // Apply column-specific searches
    Object.entries(columnSearches).forEach(([columnKey, searchValue]) => {
      if (!searchValue || typeof searchValue !== 'string') return;

      const searchLower = searchValue.toLowerCase();

      results = results.filter((order) => {
        switch (columnKey as ColumnKey) {
          case 'drinkType':
            return order.drinkType?.toLowerCase().includes(searchLower);
          case 'subtype':
            return order.drinkSubtype?.toLowerCase().includes(searchLower);
          case 'volume':
            return order.volume?.toLowerCase().includes(searchLower);
          case 'container':
            return order.containerType?.toLowerCase().includes(searchLower);
          case 'temperature':
            return order.defaultTempConsume?.toString().includes(searchLower);
          case 'id':
            return order.id?.toLowerCase().includes(searchLower);
          case 'mode':
            return order.modeId?.toLowerCase().includes(searchLower);
          default:
            return true;
        }
      });
    });

    return results.slice(0, 200); // Limit to 200 for performance
  }, [ordersData, searchTerm, columnSearches]);

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

  // Handle column search change
  const handleColumnSearchChange = useCallback((columnKey: ColumnKey, value: string) => {
    setColumnSearches((prev) => ({
      ...prev,
      [columnKey]: value,
    }));
  }, []);

  useEffect(
    function initSearchBox() {
      if (!isDrawerOpen) {
        setSearchTerm('');
        setColumnSearches({});
      }
    },
    [isDrawerOpen],
  );

  if (isLoading || (isEditMode && isOrderLoading)) {
    return (
      <Row className="form-section">
        <Col>
          <AdminSection
            className={clsx('admin-section', isEditMode ? 'mode-edit' : 'mode-new')}
            title={isEditMode ? 'Editar registro' : 'Nuevo registro'}
            // isLoading={true}
          >
            <Flex direction="column" gap="4" align="center" justify="center" p="6">
              <Spinner size="3" />
              <Text>Loading {isEditMode ? 'order' : 'orders'} data...</Text>
            </Flex>
          </AdminSection>
        </Col>
      </Row>
    );
  }

  if (error || (isEditMode && orderError)) {
    const errorMessage = error?.message || orderError?.message || 'Unknown error';
    return (
      <Row className="form-section">
        <Col>
          <AdminSection
            className={clsx('admin-section', isEditMode ? 'mode-edit' : 'mode-new')}
            title={isEditMode ? 'Editar registro' : 'Nuevo registro'}
            // error={errorMessage as any}
          >
            <Text color="red">
              Error loading {isEditMode ? 'order' : 'orders'}: {errorMessage}
            </Text>
          </AdminSection>
        </Col>
      </Row>
    );
  }

  return (
    <Flex direction="column" width="100%" gap="6">
      {/* Global search - optional, can be removed if column searches are sufficient */}
      {/* <Flex px="4" justify="start" align="center" className="search-container">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          status={isDrawerOpen ? 'active' : 'inactive'}
        />
      </Flex> */}
      <OrdersTable
        orders={filteredOrders}
        columns={DEFAULT_ORDERS_COLUMNS}
        emptyMessage="No orders found"
        emptySubMessage="Try adjusting your column filters"
        columnSearches={columnSearches}
        onColumnSearchChange={handleColumnSearchChange}
        onClickEdit={handleEditOrder}
        onClickDelete={handleDeleteOrder}
      />
    </Flex>
  );
};
