import { useQuery } from '@tanstack/react-query';
import { transformAxiosError } from '@workspace/core/api';
import { api } from 'api';
import { ORDERS_READABLE_QUERY_KEYS } from 'queries/orders';

import type { OrderReadableModel } from 'types/models/order-readable.model';

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
