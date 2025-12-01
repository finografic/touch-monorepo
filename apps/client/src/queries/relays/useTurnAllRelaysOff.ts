import { transformFetchError } from '@workspace/core/api';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import { GET_RELAY_STATES_QUERYKEY } from 'queries/relays';

export interface BulkRelayResponse {
  success: boolean;
  message: string;
}

export const useTurnAllRelaysOff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<BulkRelayResponse> => {
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
