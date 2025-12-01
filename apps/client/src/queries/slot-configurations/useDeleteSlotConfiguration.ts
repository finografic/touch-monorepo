import { transformFetchError } from '@workspace/core/api';

import { useMutation, useQueryClient } from '@tanstack/react-query';
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
        // Fetch client returns data directly
        return await api.delete<SlotConfiguration>(`/slot-configurations/${slotNumber}`);
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    onSuccess: (_, slotNumber) => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: SLOT_CONFIGURATIONS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SLOT_CONFIGURATIONS_QUERY_KEYS.detail(slotNumber) });
    },
  });
};
