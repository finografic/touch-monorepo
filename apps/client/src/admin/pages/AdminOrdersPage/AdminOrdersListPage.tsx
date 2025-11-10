import React, { useMemo, useState } from 'react';

import { TabList } from 'admin/pages/AdminOrdersPage/TabList';

import { useGetOrdersReadable } from 'queries/orders';

import { AdminPageLayout, AdminSection } from '../..';
import { useOrdersFilter } from './hooks/useOrdersFilter';

export const AdminOrdersListPage: React.FC = () => {
  // State for search/filter (empty for PrimeReact's built-in filtering)
  const [searchTerm] = useState('');

  // Fetch orders data at page level
  const { data: ordersData = [], isLoading, error } = useGetOrdersReadable();

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

  return (
    <AdminPageLayout title={title} subtitle={subtitle}>
      <AdminSection isLoading={isLoading} variant="none">
        <TabList orders={filteredOrders} isLoading={isLoading} error={error} />
      </AdminSection>
    </AdminPageLayout>
  );
};
