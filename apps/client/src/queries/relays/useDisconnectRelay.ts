import { useMutation, useQueryClient } from '@tanstack/react-query';

import { relaysEndpoints } from 'api/endpoints';
import { GET_RELAY_STATUS_QUERYKEY } from '.';

/**
 * Hook to disconnect from relay board
 */
export const useDisconnectRelay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: relaysEndpoints.disconnect,
    onSuccess: () => {
      // Invalidate relay status to reflect disconnected state
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATUS_QUERYKEY] });
    },
  });
};
