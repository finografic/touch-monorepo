import { useMutation, useQueryClient } from '@tanstack/react-query';

import { relaysEndpoints } from 'api/endpoints';
import { GET_RELAY_STATUS_QUERYKEY, GET_RELAY_STATES_QUERYKEY } from '.';

/**
 * Hook to initialize relay connection
 */
export const useInitializeRelay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: relaysEndpoints.initialize,
    onSuccess: () => {
      // Invalidate relay status and states after initialization
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATUS_QUERYKEY] });
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATES_QUERYKEY] });
    },
  });
};
