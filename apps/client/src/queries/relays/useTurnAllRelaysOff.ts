import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';
import { transformAxiosError } from 'src/api/api.utils';
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
        const response = await api.post('/relay/all-off');
        return response.data;
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    onSuccess: () => {
      // Invalidate relay states queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATES_QUERYKEY] });
    },
  });
};
