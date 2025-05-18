import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DataEntry } from 'types/data.types';
import type { OrderFieldKey, OrderFilters } from 'types/orders.types';
import { OrderFieldKeys } from '../config/app.config';
import { api } from 'api';
import type { ApiResponse } from '@workspace/shared/types/api.types';
import { useOrders } from 'providers/OrdersProvider';

export const useFilters = (initialFilters?: OrderFilters) => {
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

  // Client-side filtering
  const filteredData = useMemo(() => {
    return data.filter((entry) => {
      return Object.entries(filters).every(([key, value]) => {
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
          default:
            return true;
        }
      });
    });
  }, [data, filters]);

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

  return {
    data,
    filteredData,
    filters,
    setFilter,
    clearFilter,
    clearFilters,
    uniqueValues,
  };
};
