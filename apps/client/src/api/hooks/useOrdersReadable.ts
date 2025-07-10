import { useQuery } from '@tanstack/react-query';
import { api } from 'api';
import { transformAxiosError } from '../api.utils';
import type { OrderReadableModel } from 'types/models/order-readable.model';

// Query keys for caching
export const ORDERS_READABLE_QUERY_KEYS = {
  all: ['orders-readable'] as const,
  lists: () => [...ORDERS_READABLE_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: string) => [...ORDERS_READABLE_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...ORDERS_READABLE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ORDERS_READABLE_QUERY_KEYS.details(), id] as const,
};

/**
 * Hook to fetch orders from the orders-readable view
 * This includes all joined data with human-readable names
 */
export const useGetOrdersReadable = () => {
  return useQuery({
    queryKey: ORDERS_READABLE_QUERY_KEYS.lists(),
    queryFn: async (): Promise<OrderReadableModel[]> => {
      try {
        const response = await api.get('/orders-readable');
        return response.data.data || response.data;
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single order by ID with readable names
 */
export const useGetOrderReadableById = (orderId: string | undefined) => {
  return useQuery({
    queryKey: ORDERS_READABLE_QUERY_KEYS.detail(orderId || ''),
    queryFn: async (): Promise<OrderReadableModel> => {
      try {
        const response = await api.get(`/orders-readable/${orderId}`);
        return response.data;
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
