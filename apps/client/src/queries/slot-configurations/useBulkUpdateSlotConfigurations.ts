import { transformFetchError } from '@workspace/core/api';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import type { BulkUpdateSlotConfigRequest, SlotConfiguration } from 'types/slot-config.types';
import { SLOT_CONFIGURATIONS_QUERY_KEYS } from '.';

/**
 * Hook to bulk update slot configurations
 */
export const useBulkUpdateSlotConfigurations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BulkUpdateSlotConfigRequest): Promise<SlotConfiguration[]> => {
      try {
        // Fetch client returns data directly
        return await api.post<SlotConfiguration[]>('/slot-configurations/bulk-update', data);
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    onSuccess: () => {
      // Invalidate slot configurations query to refetch the list
      queryClient.invalidateQueries({ queryKey: SLOT_CONFIGURATIONS_QUERY_KEYS.lists() });
    },
  });
};
