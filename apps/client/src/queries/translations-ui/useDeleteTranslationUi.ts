import { transformFetchError } from '@workspace/core/api';

import { useMutation } from '@tanstack/react-query';
import { api } from 'api';

/**
 * Hook to delete a UI translation
 */
export const useDeleteTranslationUi = () => {
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      try {
        await api.delete<void>(`/translations-ui/${id}`);
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    // No automatic invalidation - handled by caller
  });
};
