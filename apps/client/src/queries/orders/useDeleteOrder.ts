import { transformFetchError } from '@workspace/core/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';
import { invalidateReferenceDataQueries } from 'queries/invalidateReferenceData';
import { GET_ORDERS_QUERYKEY, GET_ORDERS_READABLE_QUERYKEY } from 'queries/orders';

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
        throw transformFetchError(error);
      }
    },
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: GET_ORDERS_QUERYKEY });
      queryClient.invalidateQueries({ queryKey: GET_ORDERS_READABLE_QUERYKEY });
      // Also clear raw orders and reference data (types/subtypes/etc.)
      void invalidateReferenceDataQueries(queryClient);
    },
  });
};
