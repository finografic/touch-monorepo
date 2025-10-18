import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GET_RELAY_STATES_QUERYKEY, GET_RELAY_STATUS_QUERYKEY, POST_RELAY_INIT_QUERYKEY } from './index';

export const useInitializeRelay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: POST_RELAY_INIT_QUERYKEY,
    mutationFn: async () => {
      const response = await fetch('/api/relay/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initialize relay service');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate relay-related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: GET_RELAY_STATES_QUERYKEY });
      queryClient.invalidateQueries({ queryKey: GET_RELAY_STATUS_QUERYKEY });
    },
  });
};
