import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transformAxiosError } from '@workspace/core/api';
import { api } from 'api';

import type { CreateSlotConfigRequest, SlotConfiguration } from 'types/slot-config.types';
import { SLOT_CONFIGURATIONS_QUERY_KEYS } from '.';

/**
 * Hook to create a new slot configuration
 */
export const useCreateSlotConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSlotConfigRequest): Promise<SlotConfiguration> => {
      try {
        const response = await api.post('/slot-configurations', data);
        return response.data;
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    onSuccess: () => {
      // Invalidate slot configurations query to refetch the list
      queryClient.invalidateQueries({ queryKey: SLOT_CONFIGURATIONS_QUERY_KEYS.lists() });
    },
  });
};
