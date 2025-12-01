import { transformFetchError } from '@workspace/core/api';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import { SLOT_CONFIGURATIONS_QUERY_KEYS } from '.';

/**
 * Hook to reset slot configurations to default
 */
export const useResetSlotConfigurations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<{ success: boolean; message: string }> => {
      try {
        // Fetch client returns data directly
        return await api.post<{ success: boolean; message: string }>('/slot-configurations/reset');
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    onSuccess: () => {
      // Invalidate slot configurations query to refetch the list
      queryClient.invalidateQueries({ queryKey: SLOT_CONFIGURATIONS_QUERY_KEYS.lists() });
    },
  });
};
