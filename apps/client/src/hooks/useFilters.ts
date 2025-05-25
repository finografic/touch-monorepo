import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DataEntry } from 'types/data.types';
import type { OrderFieldKey, OrderFilters } from 'types/orders.types';
import { OrderFieldKeys } from 'constants/app.config';
import { api } from 'api';
import type { ApiResponse } from '@workspace/shared/types/api.types';
import { useOrders } from 'providers/OrdersProvider';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';

// Order of filter application - used to determine which filters to apply at each step
export const FILTER_ORDER: OrderFieldKey[] = [
  OrderFieldKeys.drinkType,
  OrderFieldKeys.drinkSubtype,
  OrderFieldKeys.drinkVolume,
  OrderFieldKeys.containerType,
];

export const useFilters = (initialFilters?: OrderFilters) => {
  const { fieldKey, filterKey, padsConfig } = useRouteConfig();
  const { orders } = useOrders();
  const [data, setData] = useState<DataEntry[]>([]);
  const [filters, setFilters] = useState<OrderFilters>(initialFilters ?? {});

  // Fetch all orders once at initialization
  useEffect(() => {
    api.get<ApiResponse<DataEntry[]>>('/orders').then((results) => {
      setData(results.data.data ?? results.data);
    });
  }, []);

  // Sync filters with orders
  useEffect(() => {
    const orderFilters = orders[0]?.filters;
    if (orderFilters) {
      setFilters(orderFilters);
    }
  }, [orders]);

  // Get unique values for each filter key
  const uniqueValues = useMemo(() => {
    const values: Record<string, string[]> = {};
    values[OrderFieldKeys.drinkType] = Array.from(
      new Set(data.map((d) => d.drinkTypeName).filter((v): v is string => typeof v === 'string')),
    );
    values[OrderFieldKeys.drinkSubtype] = Array.from(
      new Set(data.map((d) => d.drinkSubtypeName).filter((v): v is string => typeof v === 'string')),
    );
    values[OrderFieldKeys.drinkVolume] = Array.from(
      new Set(data.map((d) => d.volumeName).filter((v): v is string => typeof v === 'string')),
    );
    values[OrderFieldKeys.containerType] = Array.from(
      new Set(data.map((d) => d.containerTypeName).filter((v): v is string => typeof v === 'string')),
    );
    return values;
  }, [data]);

  // Helper function to apply filters to data
  const applyFilters = useCallback((entry: DataEntry, activeFilters: [string, any][]) => {
    return activeFilters.every(([key, value]) => {
      if (!value) return true;
      switch (key as OrderFieldKey) {
        case OrderFieldKeys.drinkType:
          return entry.drinkTypeName === value.name;
        case OrderFieldKeys.drinkSubtype:
          return entry.drinkSubtypeName === value.name;
        case OrderFieldKeys.drinkVolume:
          return entry.volumeName === value.name;
        case OrderFieldKeys.containerType:
          return entry.containerTypeName === value.name;
        default:
          return true;
      }
    });
  }, []);

  // Client-side filtering with both datasets
  const { dataFiltered, dataFilteredCurrent } = useMemo(() => {
    if (!fieldKey) return { dataFiltered: data, dataFilteredCurrent: data };

    const currentStepIndex = FILTER_ORDER.indexOf(fieldKey);
    if (currentStepIndex === -1) return { dataFiltered: data, dataFilteredCurrent: data };

    // Get filters up to (but not including) current step
    const filtersBeforeCurrent = Object.entries(filters).filter(([key]) => {
      const filterIndex = FILTER_ORDER.indexOf(key as OrderFieldKey);
      return filterIndex !== -1 && filterIndex < currentStepIndex;
    });

    // Get filters up to and including current step
    const filtersUpToCurrent = Object.entries(filters).filter(([key]) => {
      const filterIndex = FILTER_ORDER.indexOf(key as OrderFieldKey);
      return filterIndex !== -1 && filterIndex <= currentStepIndex;
    });

    return {
      dataFiltered: data.filter((entry) => applyFilters(entry, filtersBeforeCurrent)),
      dataFilteredCurrent: data.filter((entry) => applyFilters(entry, filtersUpToCurrent)),
    };
  }, [data, filters, fieldKey, applyFilters]);

  // Handle filter change
  const setFilter = useCallback((key: OrderFieldKey, value: any) => {
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
      (acc, [_filterKey, filterValue]) => ({ ...acc, [_filterKey as keyof DataEntry]: filterValue.name }),
      {} as Record<string, string>,
    );
  }, [filters]);

  return {
    data,
    dataFiltered,
    dataFilteredCurrent,
    filters,
    serverFieldMap,
    setFilter,
    clearFilter,
    clearFilters,
    uniqueValues,
  };
};
