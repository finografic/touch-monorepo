import { useMutation, useQueryClient } from '@tanstack/react-query';
import { slotConfigurationsEndpoints } from 'api/endpoints';

import { SLOT_CONFIGURATIONS_QUERY_KEYS } from '.';

/**
 * Hook to reset slot configurations to default
 */
export const useResetSlotConfigurations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: slotConfigurationsEndpoints.reset,
    onSuccess: () => {
      // Invalidate slot configurations query to refetch the list
      queryClient.invalidateQueries({ queryKey: SLOT_CONFIGURATIONS_QUERY_KEYS.lists() });
    },
  });
};
