import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DataEntry } from 'types/data.types';
import type { OrderFieldKey, OrderFilters } from 'types/orders.types';
import { OrderFieldKeys } from '../config/app.config';
import { api } from 'api';
import type { ApiResponse } from '@workspace/shared/types/api.types';
import { useOrders } from 'providers/OrdersProvider';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';

// Order of filter application - used to determine which filters to apply at each step
const FILTER_ORDER: OrderFieldKey[] = [
  OrderFieldKeys.drinkType,
  OrderFieldKeys.drinkSubtype,
  OrderFieldKeys.drinkVolume,
  OrderFieldKeys.containerType,
  OrderFieldKeys.initialTemperature,
  OrderFieldKeys.finalTemperature,
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

  // Client-side filtering - only apply filters up to current step
  const filteredData = useMemo(() => {
    if (!fieldKey) return data;

    // Find the index of the current field in the filter order
    const currentStepIndex = FILTER_ORDER.indexOf(fieldKey);
    if (currentStepIndex === -1) return data;

    // Get only the filters up to the current step
    const applicableFilters = Object.entries(filters).filter(([key]) => {
      const filterIndex = FILTER_ORDER.indexOf(key as OrderFieldKey);
      return filterIndex !== -1 && filterIndex < currentStepIndex;
    });

    return data.filter((entry) => {
      return applicableFilters.every(([key, value]) => {
        if (!value) return true; // If filter is empty, do not restrict
        switch (key as OrderFieldKey) {
          case OrderFieldKeys.drinkType:
            return entry.drinkTypeName === value.name;
          case OrderFieldKeys.drinkSubtype:
            return entry.drinkSubtypeName === value.name;
          case OrderFieldKeys.drinkVolume:
            return entry.volumeName === value.name;
          case OrderFieldKeys.containerType:
            return entry.containerTypeName === value.name;
          case OrderFieldKeys.initialTemperature:
            return entry.initialTemperatureName === value.name;
          case OrderFieldKeys.finalTemperature:
            return entry.finalTemperatureName === value.name;
          default:
            return true;
        }
      });
    });
  }, [data, filters, fieldKey]);

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
      // (acc, [, filterValue]) => ({ ...acc, [filterKey as keyof DataEntry]: filterValue.name }),
      (acc, [_filterKey, filterValue]) => ({ ...acc, [_filterKey as keyof DataEntry]: filterValue.name }),
      {} as Record<string, string>,
    );
  }, [filters]);

  // log('__DEV - load PAD', 'grey', padsConfig);

  return {
    data,
    filteredData,
    filters,
    serverFieldMap,
    setFilter,
    clearFilter,
    clearFilters,
    uniqueValues,
  };
};
