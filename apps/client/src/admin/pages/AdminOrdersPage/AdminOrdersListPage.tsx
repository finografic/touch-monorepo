import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Text } from '@radix-ui/themes';
import { OrdersTable } from 'admin/pages/AdminOrdersPage/OrdersTable';
import { useToast } from 'components/Toast';

import { useDeleteOrder, useGetOrdersReadable } from 'queries/orders';

import { AdminPageHeader, AdminPageLayout, AdminSection } from '../..';
import { useOrdersFilter } from './hooks/useOrdersFilter';

export const AdminOrdersListPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for search/filter (empty for PrimeReact's built-in filtering)
  const [searchTerm] = useState('');

  // Fetch orders data at page level
  const { data: ordersData = [], isLoading, error } = useGetOrdersReadable();

  // Delete order mutation
  const deleteOrderMutation = useDeleteOrder();

  // Filter orders using custom hook (PrimeReact handles column filtering internally)
  const { filteredOrders, isFiltered, totalCount, filteredCount } = useOrdersFilter({
    ordersData,
    searchTerm,
    columnSearches: {}, // PrimeReact handles its own column filtering
  });

  const { title, subtitle } = useMemo(() => {
    return {
      title: 'Gestión de configuraciones',
      subtitle: isFiltered ? `${filteredCount} results` : `${totalCount} entries`,
    };
  }, [isFiltered, filteredCount, totalCount]);

  // Handlers
  const handleEditOrder = (orderId: string) => {
    navigate(`/admin/items/${orderId}`);
  };

  const handleDeleteOrder = async (orderId: string) => {
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

  return (
    <AdminPageLayout>
      <AdminPageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <Button size="3" color="green" onClick={() => navigate('/admin/items/new')}>
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
