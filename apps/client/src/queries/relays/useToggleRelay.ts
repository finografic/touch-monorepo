import { transformFetchError } from '@workspace/core/api';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import { GET_RELAY_STATE_QUERYKEY, GET_RELAY_STATES_QUERYKEY } from 'queries/relays';

export interface ToggleRelayResponse {
  success: boolean;
  slotNumber: number;
  state: boolean;
  message: string;
}

export const useToggleRelay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      slotNumber,
      state,
    }: {
      slotNumber: number;
      state: boolean;
    }): Promise<ToggleRelayResponse> => {
      try {
        // Fetch client returns data directly
        return await api.post<ToggleRelayResponse>(`/relay/toggle/${slotNumber}/${state}`);
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    onSuccess: (data) => {
      // Invalidate relay states queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATES_QUERYKEY] });
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATE_QUERYKEY, data.slotNumber] });
    },
  });
};
