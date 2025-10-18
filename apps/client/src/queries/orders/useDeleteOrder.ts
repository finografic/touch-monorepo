import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transformAxiosError } from '@workspace/core/api';
import { api } from 'api';

import { ORDERS_READABLE_QUERY_KEYS } from 'queries/orders';

/**
 * Hook to delete an order
 */
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string): Promise<void> => {
      try {
        await api.delete(`/orders/${orderId}`);
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ORDERS_READABLE_QUERY_KEYS.lists() });
    },
  });
};
