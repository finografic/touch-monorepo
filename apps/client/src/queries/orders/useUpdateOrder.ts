import { transformFetchError } from '@workspace/core/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';
import { GET_ORDER_READABLE_QUERYKEY, GET_ORDERS_READABLE_QUERYKEY } from 'queries/orders';

/**
 * Hook to update an order
 */
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: {
        modeId?: string;
        drinkTypeId?: string;
        drinkSubtypeId?: string;
        volumeId?: string;
        containerTypeId?: string;
        defaultTempConsume?: number;
        defaultTempFreeze?: number;
      };
    }): Promise<any> => {
      try {
        return await api.patch(`/orders/${id}`, updates);
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    onSuccess: (updatedOrder) => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: GET_ORDERS_READABLE_QUERYKEY });
      queryClient.invalidateQueries({ queryKey: [...GET_ORDER_READABLE_QUERYKEY, updatedOrder.id] });
    },
  });
};
