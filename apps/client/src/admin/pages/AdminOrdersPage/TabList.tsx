import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-grid-system';
import { useNavigate, useParams } from 'react-router-dom';

import { Flex, Spinner, Text } from '@radix-ui/themes';
import type { ColumnKey, ColumnSearchState } from 'admin/pages/AdminOrdersPage/components/OrdersTable';
import { OrdersTable } from 'admin/pages/AdminOrdersPage/components/OrdersTable';
import { DEFAULT_ORDERS_COLUMNS } from 'admin/pages/AdminOrdersPage/components/OrdersTable/OrdersTable.columns';
import clsx from 'clsx';
import { useToast } from 'components/Toast';

import { useDeleteOrder, useGetOrdersReadable } from 'queries/orders';

import { AdminSection } from '../..';

export const TabList: React.FC = () => {
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
          case 'mode': {
            // Check both mode and modeId properties, convert to string for comparison
            const modeValue = (order as any).mode || order.modeId;
            return modeValue?.toString().toLowerCase().includes(searchLower);
          }
          default:
            return true;
        }
      });
    });

    return results.slice(0, 200); // Limit to 200 for performance
  }, [ordersData, searchTerm, columnSearches]);

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

  if (isLoading || isEditMode) {
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

  if (error || isEditMode) {
    const errorMessage = error?.message || 'Unknown error';
    return (
      <Row className="form-section">
        <Col>
          <AdminSection
            className={clsx('admin-section', isEditMode ? 'mode-edit' : 'mode-new')}
            // title={isEditMode ? 'Editar registro' : 'Nuevo registro'}
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
