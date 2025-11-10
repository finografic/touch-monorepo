import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { TabForm } from 'admin/pages/AdminOrdersPage/TabForm';

import { useGetOrdersReadable } from 'queries/orders';

import { AdminPageLayout, AdminSection } from '../..';
import { useOrdersFilter } from './hooks/useOrdersFilter';

export const AdminOrderEditPage: React.FC = () => {
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
    <AdminPageLayout title={title} subtitle={subtitle}>
      <AdminSection isLoading={isLoading} variant="none">
        <TabForm />
      </AdminSection>
    </AdminPageLayout>
  );
};
