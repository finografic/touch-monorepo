import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '@workspace/design-system/components';

import { OrdersForm } from 'admin/pages/AdminProductsPage/OrdersForm';
import { Flex } from 'styled-system/jsx';
import { Button } from 'components/Button';
import { useToast } from 'components/Toast';

import { useGetModes } from 'queries/modes';
import { useGetOrderReadableById, useGetOrdersReadable } from 'queries/orders';

import type { ModeModel } from 'types/models/mode.model';
import { AdminPageLayout, AdminSection } from '../..';
import { useOrdersFilter } from './hooks/useOrdersFilter';

export const AdminOrderEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { orderId } = useParams<{ orderId?: string }>();

  // Fetch orders data to get the display index
  const { data: ordersData = [] } = useGetOrdersReadable();

  // Fetch modes for form options
  const { data: modes = [], isLoading: isModesLoading } = useGetModes();
  const modeOptions = modes.map((mode: ModeModel) => ({
    value: mode.id,
    label: String(mode.name),
  }));

  // Fetch individual order data when in edit mode
  const {
    data: orderData,
    isLoading: isOrderLoading,
    error: orderError,
  } = useGetOrderReadableById({
    orderId,
    enabled: Boolean(orderId && modeOptions.length > 0),
    select: (data) => ({
      ...data,
      mode: modeOptions.find((option) => option.label === String(data.mode))?.value,
    }),
  });

  // Filter orders to get the display index helper
  const { getOrderIndex } = useOrdersFilter({
    ordersData,
    searchTerm: '',
    columnSearches: {},
  });

  const isEditMode = Boolean(orderId);
  const isLoading = isOrderLoading || isModesLoading;

  const { title, subtitle } = useMemo(() => {
    if (orderId) {
      const displayIndex = getOrderIndex(orderId);
      return {
        title: 'Editar registro',
        subtitle: displayIndex || orderId,
      };
    }

    // Calculate next index for new entries
    const nextIndex = ordersData.length + 1;
    return {
      title: 'Nuevo registro',
      subtitle: String(nextIndex),
    };
  }, [orderId, getOrderIndex, ordersData.length]);

  // Handle form submission callback (actual submission is in OrdersForm)
  const handleSubmit = () => {
    // OrdersForm handles the mutation and shows its own toast
    // This is just for navigation after success
    navigate('/admin/items');
  };

  return (
    <AdminPageLayout
      title={title}
      subtitle={subtitle}
      headerActions={
        <>
          <Button variant="outline" color="default" onClick={() => navigate('/admin/items')}>
            Cancelar
          </Button>
          <Button color="success" type="submit" form="order-form">
            {isEditMode ? 'CONFIRM CHANGES' : 'GUARDAR'}
          </Button>
        </>
      }
    >
      <AdminSection isLoading={isLoading} variant="none">
        {isLoading && isEditMode ? (
          <Flex direction="column" gap={4} align="center" justify="center" p={6}>
            <Spinner />
            <span>Loading order data...</span>
          </Flex>
        ) : orderError ? (
          <Flex direction="column" gap={4} align="center" justify="center" p={6}>
            <span>Error loading order: {orderError.message}</span>
          </Flex>
        ) : (
          <OrdersForm
            onSubmit={handleSubmit}
            orderData={isEditMode ? orderData : undefined}
            isEditMode={isEditMode}
          />
        )}
      </AdminSection>
    </AdminPageLayout>
  );
};
