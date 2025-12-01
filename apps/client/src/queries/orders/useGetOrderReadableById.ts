import { transformFetchError } from '@workspace/core/api';

import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

import { ORDERS_READABLE_QUERY_KEYS } from 'queries/orders';

import type { OrderReadableModel } from 'types/models/order-readable.model';

/**
 * Hook to fetch a single order by ID with readable names
 */
export const useGetOrderReadableById = ({
  orderId,
  enabled = true,
  select,
}: {
  orderId: string | undefined;
  enabled?: boolean;
  select?: (data: OrderReadableModel) => OrderReadableModel | undefined;
}) => {
  return useQuery({
    queryKey: ORDERS_READABLE_QUERY_KEYS.detail(orderId || ''),
    queryFn: async (): Promise<OrderReadableModel> => {
      try {
        // Fetch client returns data directly
        return await api.get<OrderReadableModel>(`/orders-readable/${orderId}`);
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    select,
    enabled: Boolean(enabled && !!orderId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
