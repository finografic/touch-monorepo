import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@radix-ui/themes';
import { TabForm } from 'admin/pages/AdminOrdersPage/TabForm';

import { useGetOrdersReadable } from 'queries/orders';

import { AdminPageHeader, AdminSection } from '../..';
import { useOrdersFilter } from './hooks/useOrdersFilter';

export const AdminOrderEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId?: string }>();

  // Fetch orders data to get the display index
  const { data: ordersData = [], isLoading } = useGetOrdersReadable();

  // Filter orders to get the display index helper
  const { getOrderIndex } = useOrdersFilter({
    ordersData,
    searchTerm: '',
    columnSearches: {},
  });

  const { title, subtitle } = useMemo(() => {
    if (orderId) {
      const displayIndex = getOrderIndex(orderId);
      return {
        title: 'Editar registro',
        subtitle: displayIndex || orderId,
      };
    }

    return {
      title: 'Editar registro',
      subtitle: '',
    };
  }, [orderId, getOrderIndex]);

  return (
    <>
      <AdminPageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <>
            <Button size="3" variant="outline" color="gray" onClick={() => navigate('/admin/items')}>
              Cancelar
            </Button>
            <Button size="3" color="green" type="submit" form="order-form">
              CONFIRM CHANGES
            </Button>
          </>
        }
      />
      <AdminSection isLoading={isLoading} variant="none">
        <TabForm />
      </AdminSection>
    </>
  );
};
