import { transformFetchError } from '@workspace/core/api';

import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

import { ORDERS_READABLE_QUERY_KEYS } from 'queries/orders';

import type { OrderReadableModel } from 'types/models/order-readable.model';

/**
 * Hook to fetch orders from the orders-readable view
 * This includes all joined data with human-readable names
 */
export const useGetOrdersReadable = () => {
  return useQuery({
    queryKey: ORDERS_READABLE_QUERY_KEYS.lists(),
    queryFn: async (): Promise<OrderReadableModel[]> => {
      try {
        // Fetch client returns data directly
        return await api.get<OrderReadableModel[]>('/orders-readable');
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
