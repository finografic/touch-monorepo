import { transformFetchError } from '@workspace/core/api';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import { GET_RELAY_STATES_QUERYKEY } from 'queries/relays';
import { useAppConfig } from 'providers/AppConfigProvider';

export interface BulkRelayResponse {
  success: boolean;
  message: string;
}

export const useTurnAllRelaysOff = () => {
  const queryClient = useQueryClient();
  const { isRelayFunctionalityEnabled } = useAppConfig();

  return useMutation({
    mutationFn: async (): Promise<BulkRelayResponse> => {
      // Prevent execution if relay functionality is disabled
      if (!isRelayFunctionalityEnabled) {
        throw new Error('Relay functionality is disabled');
      }

      try {
        // Fetch client returns data directly
        return await api.post<BulkRelayResponse>('/relay/all-off');
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    onSuccess: () => {
      // Invalidate relay states queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATES_QUERYKEY] });
    },
  });
};
