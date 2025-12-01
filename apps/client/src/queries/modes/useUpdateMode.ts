import { transformFetchError } from '@workspace/core/api';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import type { ModeModel } from 'types/models/mode.model';
import { GET_MODES_QUERYKEY } from '.';

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
    }): Promise<ModeModel> => {
      try {
        // Fetch client returns data directly
        return await api.patch<ModeModel>(`/modes/${id}`, updates);
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    onSuccess: (updatedMode) => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: [...GET_MODES_QUERYKEY] });
    },
  });
};
