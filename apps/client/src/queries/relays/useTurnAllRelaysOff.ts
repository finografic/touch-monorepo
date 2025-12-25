import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RelaysEndpoints } from 'api/endpoints';
import { GET_RELAY_STATES_QUERYKEY } from '.';

/**
 * Hook to turn all relays off
 */
export const useTurnAllRelaysOff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: RelaysEndpoints.turnAllOff,
    onSuccess: () => {
      // Invalidate all relay state queries
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATES_QUERYKEY] });
    },
  });
};
