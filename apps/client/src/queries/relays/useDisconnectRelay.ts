import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RelaysEndpoints } from 'api/endpoints';

import { GET_RELAY_STATUS_QUERYKEY } from '.';

/**
 * Hook to disconnect from relay board
 */
export const useDisconnectRelay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: RelaysEndpoints.disconnect,
    onSuccess: () => {
      // Invalidate relay status to reflect disconnected state
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATUS_QUERYKEY] });
    },
  });
};
