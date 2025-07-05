import { useQuery } from '@tanstack/react-query';
import { api } from 'api';
import { transformAxiosError__V2 } from '../api.utils';
import type { OrderModel } from 'types/models/order.model';

// Query keys for caching
export const ORDERS_READABLE_QUERY_KEYS = {
  all: ['orders-readable'] as const,
  lists: () => [...ORDERS_READABLE_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: string) => [...ORDERS_READABLE_QUERY_KEYS.lists(), { filters }] as const,
};

/**
 * Hook to fetch orders from the orders-readable view
 * This includes all joined data with human-readable names
 */
export const useGetOrdersReadable = () => {
  return useQuery({
    queryKey: ORDERS_READABLE_QUERY_KEYS.lists(),
    queryFn: async (): Promise<OrderModel[]> => {
      try {
        const response = await api.get('/orders-readable');
        return response.data.data || response.data;
      } catch (error) {
        throw transformAxiosError__V2(error);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
