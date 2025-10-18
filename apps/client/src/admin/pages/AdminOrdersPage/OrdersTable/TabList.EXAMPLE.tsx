/**
 * Example TabList.tsx showing how to use select filter variants
 *
 * This demonstrates:
 * 1. Generating dynamic options from orders data
 * 2. Creating columns with mixed filter variants
 * 3. Using the column filter system with real data
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Flex } from '@radix-ui/themes';
import {
  type ColumnDef,
  type ColumnKey,
  type ColumnSearchState,
  OrdersTable,
} from 'admin/pages/AdminOrdersPage/OrdersTable';

import { useDeleteOrder, useGetOrdersReadable } from 'queries/orders';
import type { SelectOption } from 'types/models/select-option.model';

export const TabListExample: React.FC = () => {
  const [columnSearches, setColumnSearches] = useState<ColumnSearchState>({});

  // Fetch orders data
  const { data: ordersData = [], isLoading, error } = useGetOrdersReadable();

  // ============================================================================
  // DYNAMIC OPTIONS FROM DATA
  // ============================================================================

  // Generate drink type options from actual order data
  const drinkTypeOptions = useMemo((): SelectOption[] => {
    const uniqueTypes = [...new Set(ordersData.map((o) => o.drinkType).filter(Boolean))];
    return uniqueTypes.map((type) => ({
      value: type,
      label: type,
      category: 'Existing',
      description: `Used in ${ordersData.filter((o) => o.drinkType === type).length} orders`,
    }));
  }, [ordersData]);

  // Generate volume options
  const volumeOptions = useMemo((): SelectOption[] => {
    const uniqueVolumes = [...new Set(ordersData.map((o) => o.volume).filter(Boolean))];
    return uniqueVolumes.map((vol) => ({
      value: vol,
      label: vol,
      category: 'Existing',
    }));
  }, [ordersData]);

  // Generate container options
  const containerOptions = useMemo((): SelectOption[] => {
    const uniqueContainers = [...new Set(ordersData.map((o) => o.containerType).filter(Boolean))];
    return uniqueContainers.map((container) => ({
      value: container,
      label: container,
      category: 'Existing',
    }));
  }, [ordersData]);

  // ============================================================================
  // STATIC OPTIONS (Alternative approach)
  // ============================================================================

  // You can also define static options if you know the values upfront
  const STATIC_CONTAINER_OPTIONS: SelectOption[] = [
    { value: 'plastico', label: 'Plástico', category: 'Material' },
    { value: 'metal', label: 'Metal', category: 'Material' },
    { value: 'vidrio', label: 'Vidrio', category: 'Material' },
  ];

  // ============================================================================
  // COLUMN CONFIGURATION WITH MIXED FILTERS
  // ============================================================================

  const columns: ColumnDef[] = useMemo(
    () => [
      {
        key: 'index',
        label: '#',
        width: '60px',
        searchable: false,
      },

      // SELECT filter for drink types (categorical data)
      {
        key: 'drinkType',
        label: 'Drink Type',
        width: '120px',
        searchable: true,
        filterVariant: 'select',
        filterOptions: drinkTypeOptions,
        filterPlaceholder: 'Select drink type...',
      },

      // SEARCH filter for subtypes (free-form text)
      {
        key: 'subtype',
        label: 'Subtype',
        width: '100px',
        searchable: true,
        filterVariant: 'search', // or omit (default)
        filterPlaceholder: 'Search subtype...',
      },

      // SELECT filter for volumes (standardized values)
      {
        key: 'volume',
        label: 'Volume',
        width: '80px',
        searchable: true,
        filterVariant: 'select',
        filterOptions: volumeOptions,
        filterPlaceholder: 'Select volume...',
      },

      // SELECT filter for containers (categorical data)
      {
        key: 'container',
        label: 'Container',
        width: '100px',
        searchable: true,
        filterVariant: 'select',
        filterOptions: containerOptions, // or use STATIC_CONTAINER_OPTIONS
        filterPlaceholder: 'Select container...',
      },

      // SEARCH filter for temperature (numeric/variable)
      {
        key: 'temperature',
        label: 'Temperature',
        width: '100px',
        searchable: true,
        filterVariant: 'search',
        filterPlaceholder: 'Search temp...',
      },

      {
        key: 'edit',
        label: '',
        className: 'th-action action-edit',
        width: '60px',
        searchable: false,
      },
      {
        key: 'delete',
        label: '',
        className: 'th-action action-delete',
        width: '60px',
        searchable: false,
      },
    ],
    [drinkTypeOptions, volumeOptions, containerOptions],
  );

  // ============================================================================
  // FILTERING LOGIC
  // ============================================================================

  const filteredOrders = useMemo(() => {
    let results = ordersData;

    // Apply column-specific filters
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
          default:
            return true;
        }
      });
    });

    return results.slice(0, 200); // Limit for performance
  }, [ordersData, columnSearches]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleColumnSearchChange = useCallback((columnKey: ColumnKey, value: string) => {
    setColumnSearches((prev) => ({
      ...prev,
      [columnKey]: value,
    }));
  }, []);

  const handleEditOrder = (orderId: string) => {
    console.log('Edit order:', orderId);
    // Navigate or open modal
  };

  const handleDeleteOrder = async (orderId: string) => {
    // Delete logic
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Flex direction="column" width="100%" gap="6">
      <OrdersTable
        orders={filteredOrders}
        columns={columns}
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
