import { transformFetchError } from '@workspace/core/api';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import { useAppConfig } from 'providers/AppConfigProvider';
import { GET_RELAY_STATES_QUERYKEY, GET_RELAY_STATUS_QUERYKEY } from 'queries/relays';

export interface DisconnectRelayResponse {
  success: boolean;
  message: string;
}

/**
 * Hook to disconnect from the relay board
 */
export const useDisconnectRelay = () => {
  const queryClient = useQueryClient();
  const { isRelayFunctionalityEnabled } = useAppConfig();

  return useMutation({
    mutationFn: async (): Promise<DisconnectRelayResponse> => {
      // Prevent execution if relay functionality is disabled
      if (!isRelayFunctionalityEnabled) {
        throw new Error('Relay functionality is disabled');
      }

      try {
        // Fetch client returns data directly
        return await api.post<DisconnectRelayResponse>('/relay/disconnect');
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATUS_QUERYKEY] });
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATES_QUERYKEY] });
    },
  });
};
