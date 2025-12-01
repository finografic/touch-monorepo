import { transformFetchError } from '@workspace/core/api';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import { ORDERS_READABLE_QUERY_KEYS } from 'queries/orders';

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
      queryClient.invalidateQueries({ queryKey: ORDERS_READABLE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDERS_READABLE_QUERY_KEYS.detail(updatedOrder.id) });
    },
  });
};
