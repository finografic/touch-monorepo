import { transformFetchError } from '@workspace/core/api';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api';
import { GET_ORDER_READABLE_QUERYKEY } from 'queries/orders';
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
    queryKey: [...GET_ORDER_READABLE_QUERYKEY, orderId || ''],
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
