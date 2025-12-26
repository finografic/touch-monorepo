import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EndpointsOrders, type UpdateOrderInput } from 'api/endpoints';
import {
  GET_ORDER_READABLE_QUERYKEY,
  GET_ORDERS_QUERYKEY,
  GET_ORDERS_READABLE_QUERYKEY,
} from 'queries/orders';

/**
 * Hook to update an order
 */
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateOrderInput }) =>
      EndpointsOrders.update(id, updates),
    onSuccess: (updatedOrder) => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: GET_ORDERS_QUERYKEY });
      queryClient.invalidateQueries({ queryKey: GET_ORDERS_READABLE_QUERYKEY });
      queryClient.invalidateQueries({ queryKey: [...GET_ORDER_READABLE_QUERYKEY, updatedOrder.id] });
    },
  });
};
