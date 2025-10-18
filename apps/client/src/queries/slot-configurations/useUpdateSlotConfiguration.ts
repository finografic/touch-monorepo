import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transformAxiosError } from '@workspace/core/api';
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
      slotNumber,
      data,
    }: {
      slotNumber: number;
      data: UpdateSlotConfigRequest;
    }): Promise<SlotConfiguration> => {
      try {
        const response = await api.put(`/slot-configurations/${slotNumber}`, data);
        return response.data;
      } catch (error) {
        throw transformAxiosError(error);
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
