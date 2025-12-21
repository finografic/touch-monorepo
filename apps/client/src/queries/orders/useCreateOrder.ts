import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ordersEndpoints, type CreateOrderWithProfilesInput } from 'api/endpoints';
import { GET_ORDERS_QUERYKEY, GET_ORDERS_READABLE_QUERYKEY } from 'queries/orders';

/**
 * Hook to create a new order
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersEndpoints.create,
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: GET_ORDERS_QUERYKEY });
      queryClient.invalidateQueries({ queryKey: GET_ORDERS_READABLE_QUERYKEY });
    },
  });
};

// Re-export type for backward compatibility
export type { CreateOrderWithProfilesInput };
