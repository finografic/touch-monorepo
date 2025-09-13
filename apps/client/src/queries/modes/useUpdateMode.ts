import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';
import { transformAxiosError } from 'api/api.utils';
import { GET_MODES_QUERYKEY } from '.';
import type { Mode } from 'types/models/mode.model';

/**
 * Hook to update a mode
 */
export const useUpdateMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: {
        name?: string;
        description?: string;
        isDefault?: boolean;
      };
    }): Promise<Mode> => {
      try {
        const response = await api.patch(`/modes/${id}`, updates);
        return response.data;
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    onSuccess: (updatedMode) => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: [...GET_MODES_QUERYKEY] });
    },
  });
};
