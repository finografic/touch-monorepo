import { useQuery } from '@tanstack/react-query';
import { api } from 'api';
import { transformAxiosError } from 'api/api.utils';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import { ORDERS_READABLE_QUERY_KEYS } from 'queries/orders';

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
