import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Flex, Text } from '@radix-ui/themes';
import { OrdersTable } from 'admin/pages/AdminOrdersPage/OrdersTable';
import { Button } from 'components/Button';
import { useToast } from 'components/Toast';

import { useDeleteOrder, useGetOrdersReadable } from 'queries/orders';

import { AdminPageHeader, AdminPageLayout, AdminSection } from '../..';
import { useOrdersFilter } from './hooks/useOrdersFilter';

export const AdminOrdersListPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for search/filter (empty for PrimeReact's built-in filtering)
  const [searchTerm] = useState('');

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

  return (
    <AdminPageLayout>
      <AdminPageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <Button color="success" onClick={handleCreateNew}>
            + Create New
          </Button>
        }
      />
      <AdminSection isLoading={isLoading} variant="none">
        {error ? (
          <Flex direction="column" gap="4" align="center" justify="center" p="6">
            <Text color="red">Error loading orders: {error.message}</Text>
          </Flex>
        ) : (
          <OrdersTable
            orders={filteredOrders}
            emptyMessage="No orders found. Try adjusting your filters."
            onClickEdit={handleEditOrder}
            onClickDelete={handleDeleteOrder}
          />
        )}
      </AdminSection>
    </AdminPageLayout>
  );
};
