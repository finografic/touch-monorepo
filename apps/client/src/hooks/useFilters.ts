import { useCallback, useEffect, useMemo, useState } from 'react';
import type { OrderFieldKey } from 'types/orders.types';
import type { OrderFilters } from 'types/filters.types';
import type { OrderModel } from 'types/models/order.model';
import { api } from 'api';
import type { ApiResponse } from '@workspace/core/api';
import { useOrders } from 'providers/OrdersProvider';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { getFiltersByStep, getUniqueFilterValues, matchesFilters } from 'utils/filters.utils';
import { useSession } from 'providers/SessionProvider/SessionContext';

interface UseFiltersReturn {
  // Data arrays - using the OrderModel type which extends DataEntry
  data: OrderModel[];
  dataPool: OrderModel[];
  dataFiltered: OrderModel[];

  // Filters state
  filters: OrderFilters;
  serverFieldMap: Record<string, string>;

  // Filter manipulation functions
  setFilter: (key: OrderFieldKey, value: unknown) => void;
  clearFilter: (key: OrderFieldKey) => void;
  clearFilters: () => void;

  // Unique values for filters - matches the return type of getUniqueFilterValues
  uniqueValues: Record<string, string[]>;
}

export const useFilters = (initialFilters?: OrderFilters): UseFiltersReturn => {
  const { fieldKey } = useRouteConfig();
  const { orders } = useOrders();
  const { currentSessionId, sessions } = useSession();
  const [data, setData] = useState<OrderModel[]>([]);
  const [filters, setFilters] = useState<OrderFilters>(initialFilters ?? {});

  // Fetch orders data
  useEffect(() => {
    api.get<ApiResponse<OrderModel[]>>('/orders').then((results) => {
      setData(results.data.data ?? results.data);
    });
  }, []);

  // Sync filters with current configuration session
  useEffect(() => {
    if (currentSessionId && sessions[currentSessionId]) {
      const sessionFilters = sessions[currentSessionId].filters;
      setFilters(sessionFilters || {});
    } else {
      // Only fall back to order filters if we don't have any current session
      const orderFilters = orders[0]?.filters;
      if (orderFilters) {
        setFilters(orderFilters);
      } else {
        setFilters({});
      }
    }
  }, [orders, currentSessionId, sessions]);

  // Get unique values for each filter key
  const uniqueValues = useMemo(() => getUniqueFilterValues(data), [data]);

  // Client-side filtering with both datasets
  const { dataPool, dataFiltered } = useMemo(() => {
    if (!fieldKey) return { dataPool: data, dataFiltered: data };

    const filtersBeforeCurrent = getFiltersByStep(filters, fieldKey, false);
    const filtersUpToCurrent = getFiltersByStep(filters, fieldKey, true);

    return {
      dataPool: data.filter((entry) => matchesFilters(entry, filtersBeforeCurrent)),
      dataFiltered: data.filter((entry) => matchesFilters(entry, filtersUpToCurrent)),
    };
  }, [data, filters, fieldKey]);

  // Handle filter change
  const setFilter = useCallback((key: OrderFieldKey, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Clear specific filter
  const clearFilter = useCallback((key: OrderFieldKey) => {
    setFilters((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Map filter keys from app-local names to server-side field names
  const serverFieldMap = useMemo(() => {
    return Object.entries(filters as OrderFilters).reduce(
      (acc, [_filterKey, filterValue]) => ({ ...acc, [_filterKey as string]: filterValue.name }),
      {} as Record<string, string>,
    );
  }, [filters]);

  return {
    data,
    dataPool,
    dataFiltered,
    filters,
    serverFieldMap,
    setFilter,
    clearFilter,
    clearFilters,
    uniqueValues,
  };
};
