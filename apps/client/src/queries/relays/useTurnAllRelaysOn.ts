import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RelaysEndpoints } from 'api/endpoints';
import { GET_RELAY_STATES_QUERYKEY } from '.';

/**
 * Hook to turn all relays on
 */
export const useTurnAllRelaysOn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: RelaysEndpoints.turnAllOn,
    onSuccess: () => {
      // Invalidate all relay state queries
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATES_QUERYKEY] });
    },
  });
};
