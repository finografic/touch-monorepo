import { useMemo } from 'react';

import { useFiltersContext } from 'providers/FiltersProvider';
import { useOrders } from 'providers/OrdersProvider';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import type { DataEntry } from 'types/data.types';
import type { OrderFilters } from 'types/filters.types';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { FilterKey } from 'types/orders.types';
import { filterData, getUniqueFilterValues } from 'utils/filters/filters.utils';

interface UseFiltersReturn {
  // Data arrays - using the OrderReadableModel type for human-readable data
  data: OrderReadableModel[];
  dataPool: OrderReadableModel[];
  dataFiltered: OrderReadableModel[];

  // Filters state (from FiltersContext)
  filters: OrderFilters;
  filterKey: FilterKey;
  serverFieldMap: Record<string, string>;

  // Filter manipulation functions (from FiltersContext)
  setFilter: (key: keyof OrderFilters, value: unknown) => void;
  clearFilter: (key: keyof OrderFilters) => void;
  clearFilters: () => void;

  // Unique values for filters
  uniqueValues: Record<string, string[]>;
}

/**
 * Comprehensive filters hook that extends FiltersContext with orders_readable data filtering
 * This is the final hook that replaces useFiltersWithData and provides all filtering functionality
 */
export const useFilters = (): UseFiltersReturn => {
  const { filterKey, filterApiKey, loaderData } = useRouteConfig();
  const { ordersReadable } = useOrders();
  const { filters, setFilter, clearFilter, clearFilters } = useFiltersContext();

  // Use the ordersReadable data from OrdersContext - fetched once at provider level
  const data: OrderReadableModel[] = ordersReadable;

  // Get unique values for each filter key
  const safeData: DataEntry[] = Array.isArray(data) ? (data as unknown as DataEntry[]) : [];
  const uniqueValues = useMemo(() => getUniqueFilterValues(safeData), [safeData]);

  // Client-side filtering with orders_readable data using dedicated utility
  const { dataPool, dataFiltered } = useMemo(() => {
    // Only filter when loaderData is ready (non-empty dataset)
    if (!Array.isArray(loaderData)) {
      return {
        dataPool: [],
        dataFiltered: [],
      };
    }

    return filterData({
      data,
      filters,
      filterKey: filterKey || ('' as FilterKey),
      applyContainerTypeFix: true,
    });
  }, [data, filters, filterKey, loaderData]);

  // Map filter keys from app-local names to server-side field names
  const serverFieldMap = useMemo(() => {
    return Object.entries(filters).reduce(
      (acc, [filterApiKey, filterValue]) => {
        if (filterApiKey in filters) {
          return { ...acc, [filterApiKey as string]: filterValue.name };
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
    filterKey: filterKey === ('base' as FilterKey) ? 'mode' : filterKey,
    filters,
    serverFieldMap,
    setFilter,
    clearFilter,
    clearFilters,
    uniqueValues,
  };
};
