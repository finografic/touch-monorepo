import { useQuery } from '@tanstack/react-query';
import { api } from 'api';
import { transformAxiosError } from '@workspace/core/api';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import { ORDERS_READABLE_QUERY_KEYS } from 'queries/orders';

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
        return response.data;
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
