import { useMutation } from '@tanstack/react-query';
import { translationsUiEndpoints } from 'api/endpoints';

/**
 * Hook to delete a UI translation
 */
export const useDeleteTranslationUi = () => {
  return useMutation({
    mutationFn: translationsUiEndpoints.delete,
    // No automatic invalidation - handled by caller
  });
};
