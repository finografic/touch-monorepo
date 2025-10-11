import { useMemo } from 'react';
import { useFiltersContext } from 'providers/FiltersProvider';
import { useOrders } from 'providers/OrdersProvider';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import {
  getFiltersByStep,
  getOrderedFilters,
  getUniqueFilterValues,
  matchesFilters,
} from 'utils/filters.utils';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { DataEntry } from 'types/data.types';
import type { OrderFilters } from 'types/filters.types';
import type { SlotFilterKey } from 'types/orders.types';

interface UseFiltersReturn {
  // Data arrays - using the OrderReadableModel type for human-readable data
  data: OrderReadableModel[];
  dataPool: OrderReadableModel[];
  dataFiltered: OrderReadableModel[];

  // Filters state (from FiltersContext)
  filters: OrderFilters;
  fieldKey: SlotFilterKey;
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
  const { fieldKey } = useRouteConfig();
  const { ordersReadable } = useOrders();
  const { filters, setFilter, clearFilter, clearFilters } = useFiltersContext();

  // Use the ordersReadable data from OrdersContext - fetched once at provider level
  const data: OrderReadableModel[] = ordersReadable;

  // Get unique values for each filter key
  // SAFEGUARD: ensure data is assignable to DataEntry[]
  const safeData: DataEntry[] = Array.isArray(data) ? (data as unknown as DataEntry[]) : [];
  const uniqueValues = useMemo(() => getUniqueFilterValues(safeData), [safeData]);

  // Client-side filtering with orders_readable data
  const { dataPool, dataFiltered } = useMemo(() => {
    // SAFEGUARD: ensure data is assignable to DataEntry[] for matchesFilters
    const safeDataForFilter: DataEntry[] = Array.isArray(data) ? (data as unknown as DataEntry[]) : [];

    // For dataFiltered, use ALL filters in ordered format (mode first)
    const allFilters = getOrderedFilters(filters);
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

  // Map filter keys from app-local names to server-side field names
  const serverFieldMap = useMemo(() => {
    return Object.entries(filters).reduce(
      (acc, [filterKey, filterValue]) => {
        if (filterKey in filters) {
          return { ...acc, [filterKey as string]: filterValue.name };
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
    fieldKey,
    filters,
    serverFieldMap,
    setFilter,
    clearFilter,
    clearFilters,
    uniqueValues,
  };
};
