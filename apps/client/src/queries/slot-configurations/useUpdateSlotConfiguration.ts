import { transformFetchError } from '@workspace/core/api';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import type { SlotConfiguration, UpdateSlotConfigRequest } from 'types/slot-config.types';
import { SLOT_CONFIGURATIONS_QUERY_KEYS } from '.';

/**
 * Hook to update a slot configuration
 */
export const useUpdateSlotConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSlotConfigRequest;
    }): Promise<SlotConfiguration> => {
      try {
        // Fetch client returns data directly
        return await api.patch<SlotConfiguration>(`/slot-configurations/${id}`, data);
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    onSuccess: (updatedConfig) => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: SLOT_CONFIGURATIONS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: SLOT_CONFIGURATIONS_QUERY_KEYS.detail(updatedConfig.slotNumber),
      });
    },
  });
};
