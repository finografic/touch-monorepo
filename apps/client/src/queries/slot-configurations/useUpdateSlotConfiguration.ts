import { useMutation, useQueryClient } from '@tanstack/react-query';
import { slotConfigurationsEndpoints } from 'api/endpoints';

import type { UpdateSlotConfigRequest } from 'types/slot-config.types';
import { SLOT_CONFIGURATIONS_QUERY_KEYS } from '.';

/**
 * Hook to update an existing slot configuration
 */
export const useUpdateSlotConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slotNumber, data }: { slotNumber: number; data: UpdateSlotConfigRequest }) =>
      slotConfigurationsEndpoints.update(slotNumber, data),
    onSuccess: (_, { slotNumber }) => {
      // Invalidate slot configurations queries
      queryClient.invalidateQueries({ queryKey: SLOT_CONFIGURATIONS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SLOT_CONFIGURATIONS_QUERY_KEYS.detail(slotNumber) });
    },
  });
};
