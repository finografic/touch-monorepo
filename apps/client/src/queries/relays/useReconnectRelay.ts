import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RelaysEndpoints } from 'api/endpoints';
import { GET_RELAY_STATUS_QUERYKEY, GET_RELAY_STATES_QUERYKEY } from '.';

/**
 * Hook to reconnect to relay board
 */
export const useReconnectRelay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: RelaysEndpoints.reconnect,
    onSuccess: () => {
      // Invalidate relay status and states after reconnection
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATUS_QUERYKEY] });
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATES_QUERYKEY] });
    },
  });
};
