import { useQuery } from '@tanstack/react-query';

import { ordersEndpoints } from 'api/endpoints';
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
  return useQuery<OrderReadableModel>({
    queryKey: [...GET_ORDER_READABLE_QUERYKEY, orderId || ''],
    queryFn: () => ordersEndpoints.getByIdReadable(orderId!),
    select,
    enabled: Boolean(enabled && !!orderId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
