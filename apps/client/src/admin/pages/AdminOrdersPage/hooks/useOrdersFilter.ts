import { useMemo } from 'react';

import type { OrderReadableModel } from 'types/models/order-readable.model';

import type { ColumnKey, ColumnSearchState } from '../components/OrdersTable';

export interface OrderReadableWithIndex extends OrderReadableModel {
  displayIndex: string; // e.g., "0001", "0042"
}

interface UseOrdersFilterProps {
  ordersData: OrderReadableModel[];
  searchTerm?: string;
  columnSearches?: ColumnSearchState;
  maxResults?: number;
}

interface UseOrdersFilterReturn {
  filteredOrders: OrderReadableWithIndex[];
  isFiltered: boolean;
  totalCount: number;
  filteredCount: number;
  getOrderIndex: (orderId: string) => string | null;
}

/**
 * Custom hook for filtering orders based on global search and column-specific searches
 * @param ordersData - Array of orders to filter
 * @param searchTerm - Global search term (optional)
 * @param columnSearches - Column-specific search terms (optional)
 * @param maxResults - Maximum number of results to return (default: undefined, no limit)
 * @returns Filtered orders and metadata about the filtering state
 */
export function useOrdersFilter({
  ordersData,
  searchTerm = '',
  columnSearches = {},
  maxResults,
}: UseOrdersFilterProps): UseOrdersFilterReturn {
  // Create a map of orderId to displayIndex (based on original order in the data)
  const orderIndexMap = useMemo(() => {
    const map = new Map<string, string>();
    ordersData.forEach((order, index) => {
      // map.set(order.id, String(index + 1).padStart(4, '0'));
      map.set(order.id, String(index + 1));
    });
    return map;
  }, [ordersData]);

  const filteredOrders = useMemo(() => {
    let results = ordersData;

    // Apply global search (if provided)
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

    // Add displayIndex to each order and limit results (if maxResults is specified)
    const limitedResults = maxResults ? results.slice(0, maxResults) : results;
    return limitedResults.map((order) => ({
      ...order,
      displayIndex: orderIndexMap.get(order.id) || '0000',
    }));
  }, [ordersData, searchTerm, columnSearches, maxResults, orderIndexMap]);

  // Determine if any filtering is active
  const isFiltered = useMemo(() => {
    const hasGlobalSearch = Boolean(searchTerm);
    const hasColumnSearch = Object.values(columnSearches).some((value) => Boolean(value));
    return hasGlobalSearch || hasColumnSearch;
  }, [searchTerm, columnSearches]);

  // Helper function to get the display index for a specific order ID
  const getOrderIndex = (orderId: string): string | null => {
    return orderIndexMap.get(orderId) || null;
  };

  return {
    filteredOrders,
    isFiltered,
    totalCount: ordersData.length,
    filteredCount: filteredOrders.length,
    getOrderIndex,
  };
}
