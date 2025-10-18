import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transformAxiosError } from '@workspace/core/api';
import { api } from 'api';

import type { SlotConfiguration } from 'types/slot-config.types';
import { SLOT_CONFIGURATIONS_QUERY_KEYS } from '.';

/**
 * Hook to delete a slot configuration
 */
export const useDeleteSlotConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slotNumber: number): Promise<SlotConfiguration> => {
      try {
        const response = await api.delete(`/slot-configurations/${slotNumber}`);
        return response.data;
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    onSuccess: (_, slotNumber) => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: SLOT_CONFIGURATIONS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SLOT_CONFIGURATIONS_QUERY_KEYS.detail(slotNumber) });
    },
  });
};
