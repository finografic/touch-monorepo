import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-grid-system';
import { useNavigate, useParams } from 'react-router-dom';

import { Flex, Spinner, Text } from '@radix-ui/themes';
import type { ColumnKey, ColumnSearchState } from 'admin/pages/AdminOrdersPage/components/OrdersTable';
import { OrdersTable } from 'admin/pages/AdminOrdersPage/components/OrdersTable';
import { DEFAULT_ORDERS_COLUMNS } from 'admin/pages/AdminOrdersPage/components/OrdersTable/OrdersTable.columns';
import clsx from 'clsx';
import { useToast } from 'components/Toast';

import { useDeleteOrder } from 'queries/orders';

import { AdminSection } from '../..';
import type { OrderReadableWithIndex } from './hooks/useOrdersFilter';

interface TabListProps {
  orders: OrderReadableWithIndex[];
  columnSearches: ColumnSearchState;
  onColumnSearchChange: React.Dispatch<React.SetStateAction<ColumnSearchState>>;
  isLoading: boolean;
  error: Error | null;
}

export const TabList: React.FC<TabListProps> = ({
  orders,
  columnSearches,
  onColumnSearchChange,
  isLoading,
  error,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId?: string }>();

  // Determine if we're in edit mode
  const isEditMode = Boolean(orderId);

  // Delete order mutation
  const deleteOrderMutation = useDeleteOrder();

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
  const handleColumnSearchChange = useCallback(
    (columnKey: ColumnKey, value: string) => {
      onColumnSearchChange((prev) => ({
        ...prev,
        [columnKey]: value,
      }));
    },
    [onColumnSearchChange],
  );

  useEffect(
    function initSearchBox() {
      if (!isDrawerOpen) {
        onColumnSearchChange({});
      }
    },
    [isDrawerOpen, onColumnSearchChange],
  );

  if (isLoading || isEditMode) {
    return (
      <Flex direction="column" gap="4" align="center" justify="center" p="6">
        <Spinner size="3" />
        <Text>Loading {isEditMode ? 'order' : 'orders'} data...</Text>
      </Flex>
    );
  }

  if (error || isEditMode) {
    const errorMessage = error?.message || 'Unknown error';
    return (
      <Flex direction="column" gap="4" align="center" justify="center" p="6">
        <Text color="red">
          Error loading {isEditMode ? 'order' : 'orders'}: {errorMessage}
        </Text>
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      width="100%"
      gap="6"
      //  style={{ border: '2px solid red"', overflowY: 'scroll' }}
    >
      <OrdersTable
        orders={orders}
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
