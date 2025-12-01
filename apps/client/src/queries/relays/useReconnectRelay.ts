import { transformFetchError } from '@workspace/core/api';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

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
        // Fetch client returns data directly
        return await api.post<ReconnectResponse>('/relay/reconnect');
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    onSuccess: () => {
      // Invalidate relay status query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATUS_QUERYKEY] });
    },
  });
};
