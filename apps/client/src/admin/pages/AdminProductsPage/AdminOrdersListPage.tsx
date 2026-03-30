import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Flex } from 'styled-system/jsx';
// import { Button } from 'components/Button';
import { Button } from '@finografic/design-system/components';
import { useToast } from 'components/Toast';

import { useDeleteOrder, useGetOrdersReadable } from 'queries/orders';

import { AdminPageLayout, AdminSection } from '../..';
import type { OrderReadableWithIndex } from './hooks/useOrdersFilter';
import { useOrdersFilter } from './hooks/useOrdersFilter';
import { OrdersTable } from './OrdersTable';

export const AdminOrdersListPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for search/filter (empty for PrimeReact's built-in filtering)
  const [searchTerm] = useState('');

  // State for selected orders (for batch deletion)
  const [selectedOrders, setSelectedOrders] = useState<OrderReadableWithIndex[]>([]);

  const { data: ordersData = [], isLoading, error } = useGetOrdersReadable();
  const { filteredOrders, isFiltered, totalCount, filteredCount } = useOrdersFilter({
    ordersData,
    searchTerm,
    columnSearches: {}, // PrimeReact handles its own column filtering
  });

  const deleteOrderMutation = useDeleteOrder();

  const { title, subtitle } = useMemo(() => {
    return {
      title: 'Gestión de configuraciones',
      subtitle: isFiltered ? `${filteredCount} results` : `${totalCount} entries`,
    };
  }, [isFiltered, filteredCount, totalCount]);

  // Simple button handler - no memoization needed
  const handleCreateNew = () => {
    navigate('/admin/items/new');
  };

  // Passed to OrdersTable (memoized) - use useCallback
  const handleEditOrder = useCallback(
    (orderId: string) => {
      navigate(`/admin/items/${orderId}`);
    },
    [navigate],
  );

  const handleDeleteOrder = useCallback(
    async (orderId: string) => {
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
    },
    [deleteOrderMutation, toast],
  );

  const handleDeleteSelected = useCallback(async () => {
    if (selectedOrders.length === 0) return;

    // eslint-disable-next-line no-alert
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedOrders.length} selected order(s)? This action cannot be undone.`,
    );

    if (!confirmDelete) return;

    try {
      // Delete all selected orders sequentially
      const deletePromises = selectedOrders.map((order) =>
        deleteOrderMutation.mutateAsync(order.id)
      );
      await Promise.all(deletePromises);

      toast({
        variant: 'success',
        message: 'Orders deleted successfully!',
        subText: `${selectedOrders.length} order(s) have been removed`,
      });

      // Clear selection after successful deletion
      setSelectedOrders([]);
    } catch (error) {
      console.error('Failed to delete selected orders:', error);
      toast({
        variant: 'error',
        message: 'Failed to delete some orders',
        subText: 'Please try again or contact support',
      });
    }
  }, [selectedOrders, deleteOrderMutation, toast]);

  return (
    <AdminPageLayout
      title={title}
      subtitle={subtitle}
      headerActions={
        <Flex gap={2} align="center">
          {selectedOrders.length > 0 && (
            <Button variant="solid" palette="danger" onClick={handleDeleteSelected}>
              Delete Selected ({selectedOrders.length})
            </Button>
          )}
          <Button variant="solid" palette="success" onClick={handleCreateNew}>
            + Create New
          </Button>
        </Flex>
      }
    >
      <AdminSection isLoading={isLoading} variant="none">
        {error
          ? (
            <Flex direction="column" gap={4} align="center" justify="center" p={6}>
              <span>Error loading orders: {error.message}</span>
            </Flex>
          )
          : (
            <OrdersTable
              orders={filteredOrders}
              emptyMessage="No orders found. Try adjusting your filters."
              onClickEdit={handleEditOrder}
              onClickDelete={handleDeleteOrder}
              selectedOrders={selectedOrders}
              onSelectionChange={setSelectedOrders}
            />
          )}
      </AdminSection>
    </AdminPageLayout>
  );
};
