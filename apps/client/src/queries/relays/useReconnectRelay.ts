import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';
import { transformAxiosError } from '@workspace/core/api';

import { GET_RELAY_STATUS_QUERYKEY } from 'queries/relays';

export interface ReconnectResponse {
  success: boolean;
  message: string;
}

export const useReconnectRelay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<ReconnectResponse> => {
      try {
        const response = await api.post('/relay/reconnect');
        return response.data;
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    onSuccess: () => {
      // Invalidate relay status query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATUS_QUERYKEY] });
    },
  });
};
