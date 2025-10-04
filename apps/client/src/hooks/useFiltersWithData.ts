import { useCallback, useEffect, useMemo } from 'react';
import { useFilters } from 'providers/FiltersProvider';
import { useOrders } from 'providers/OrdersProvider';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { getFiltersByStep, getUniqueFilterValues, matchesFilters } from 'utils/filters.utils';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { DataEntry } from 'types/data.types';
import type { SlotFilterKey } from 'types/orders.types';
import type { OrderFilters } from 'types/filters.types';

interface UseFiltersWithDataReturn {
  // Data arrays - using the OrderReadableModel type for human-readable data
  data: OrderReadableModel[];
  dataPool: OrderReadableModel[];
  dataFiltered: OrderReadableModel[];

  // Filters state
  filters: OrderFilters;
  serverFieldMap: Record<string, string>;

  // Filter manipulation functions
  setFilter: (key: SlotFilterKey, value: unknown) => void;
  clearFilter: (key: SlotFilterKey) => void;
  clearFilters: () => void;

  // Unique values for filters - matches the return type of getUniqueFilterValues
  uniqueValues: Record<string, string[]>;
}

/**
 * Enhanced filters hook that combines FiltersContext with orders_readable data filtering
 * This replaces the legacy useFiltering hook with proper orders_readable support
 */
export const useFiltersWithData = (): UseFiltersWithDataReturn => {
  const { fieldKey } = useRouteConfig();
  const { orders, updateOrderIds, ordersReadable } = useOrders();
  const { currentSessionId, sessions } = useSession();
  const { filters, setFilter, clearFilter, clearFilters } = useFilters();

  // Use the ordersReadable data from OrdersContext - fetched once at provider level
  const data: OrderReadableModel[] = ordersReadable;

  // Sync filters with current configuration session
  useEffect(() => {
    if (currentSessionId && sessions[currentSessionId]) {
      const sessionFilters = sessions[currentSessionId].filters;
      if (sessionFilters && Object.keys(sessionFilters).length > 0) {
        // Update FiltersContext with session filters
        Object.entries(sessionFilters).forEach(([key, value]) => {
          setFilter(key as SlotFilterKey, value);
        });
      }
    } else {
      // Only fall back to order filters if we don't have any current session
      const orderFilters = orders[0]?.filters;
      if (orderFilters && Object.keys(orderFilters).length > 0) {
        Object.entries(orderFilters).forEach(([key, value]) => {
          setFilter(key as SlotFilterKey, value);
        });
      }
    }
  }, [orders, currentSessionId, sessions, setFilter]);

  // Get unique values for each filter key
  // SAFEGUARD: ensure data is assignable to DataEntry[]
  const safeData: DataEntry[] = Array.isArray(data) ? (data as unknown as DataEntry[]) : [];
  const uniqueValues = useMemo(() => getUniqueFilterValues(safeData), [safeData]);

  // Client-side filtering with orders_readable data
  const { dataPool, dataFiltered } = useMemo(() => {
    // SAFEGUARD: ensure data is assignable to DataEntry[] for matchesFilters
    const safeDataForFilter: DataEntry[] = Array.isArray(data) ? (data as unknown as DataEntry[]) : [];

    // For dataFiltered, use ALL filters
    const allFilters = Object.entries(filters);
    let filtered = safeDataForFilter.filter((entry) =>
      matchesFilters(entry, allFilters),
    ) as unknown as OrderReadableModel[];

    // For dataPool (for filter options), use only filters up to the current step
    let pool = safeDataForFilter;
    if (fieldKey) {
      const filtersBeforeCurrent = getFiltersByStep(filters, fieldKey, false);
      pool = safeDataForFilter.filter((entry) => matchesFilters(entry, filtersBeforeCurrent));
    }

    // TEMP FIX: If containerType filter is present, only return the first entry
    if (filters.containerType) {
      filtered = filtered.length > 0 ? [filtered[0]] : [];
    }

    return {
      dataPool: pool as unknown as OrderReadableModel[],
      dataFiltered: filtered as unknown as OrderReadableModel[],
    };
  }, [data, filters, fieldKey]);

  // Update order IDs when filtered data changes - separate from filtering logic
  useEffect(() => {
    if (Object.keys(filters).length > 0 && dataFiltered.length > 0) {
      const allIds = dataFiltered.map((o) => o.id);
      updateOrderIds({ ids: allIds });
    }
  }, [dataFiltered, filters, updateOrderIds]);

  // Map filter keys from app-local names to server-side field names
  const serverFieldMap = useMemo(() => {
    return Object.entries(filters as OrderFilters).reduce(
      (acc, [_filterKey, filterValue]) => {
        // ✅ Check if filterValue exists and has a name property
        if (filterValue && typeof filterValue === 'object' && 'name' in filterValue) {
          return { ...acc, [_filterKey as string]: filterValue.name };
        }
        return acc;
      },
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
