import { useMemo } from 'react';

import { useFiltersContext } from 'providers/FiltersProvider';
import { useOrders } from 'providers/OrdersProvider';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';

import { filterData, getUniqueFilterValues } from 'utils/filters/filters.utils';
import type { DataEntry } from 'types/data.types';
import type { OrderFilters } from 'types/filters.types';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { FilterKey } from 'types/slots.types';

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
  // ⚠️ Can be undefined on alternative routes (like TimePage) where orders aren't needed
  // For non-product-flow routes, ordersReadable might not be initialized yet
  const data: OrderReadableModel[] = ordersReadable || [];

  // 🚀 PERFORMANCE: Memoize safeData to prevent re-creating array on every render
  const safeData: DataEntry[] = useMemo(() => {
    return Array.isArray(data) ? (data as unknown as DataEntry[]) : [];
  }, [data]);

  // Get unique values for each filter key
  const uniqueValues = useMemo(() => getUniqueFilterValues(safeData), [safeData]);

  // 🚀 PERFORMANCE: Stringify filters for stable dependency checking
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  // Client-side filtering with orders_readable data using dedicated utility
  const { dataPool, dataFiltered } = useMemo(() => {
    // Only filter when loaderData is ready (non-empty dataset)
    if (!Array.isArray(loaderData) || loaderData.length === 0) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length, filtersKey, filterKey, loaderData?.length]);

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
