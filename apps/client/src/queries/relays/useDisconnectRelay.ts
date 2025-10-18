import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transformAxiosError } from '@workspace/core/api';
import { api } from 'api';
import { GET_RELAY_STATES_QUERYKEY, GET_RELAY_STATUS_QUERYKEY } from 'queries/relays';

interface DisconnectRelayResponse {
  success: boolean;
  message: string;
}

/**
 * Hook to disconnect from the relay board
 */
export const useDisconnectRelay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<DisconnectRelayResponse> => {
      try {
        const response = await api.post<DisconnectRelayResponse>('/relay/disconnect');
        return response.data;
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATUS_QUERYKEY] });
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATES_QUERYKEY] });
    },
  });
};
