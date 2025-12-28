import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RelaysEndpoints, type ToggleRelayInput, type ToggleRelayResponse } from 'api/endpoints';

import { GET_RELAY_STATE_QUERYKEY, GET_RELAY_STATES_QUERYKEY } from '.';

/**
 * Hook to toggle a relay on/off
 */
export const useToggleRelay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slotNumber, state }: ToggleRelayInput) => RelaysEndpoints.toggle(slotNumber, state),
    onSuccess: (_: ToggleRelayResponse, { slotNumber }) => {
      // Invalidate relay state queries
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATES_QUERYKEY] });
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATE_QUERYKEY, slotNumber] });
    },
  });
};
