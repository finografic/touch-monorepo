import { useMutation } from '@tanstack/react-query';

import { translationsUiEndpoints, type CreateTranslationUiInput } from 'api/endpoints';

/**
 * Hook to create a new UI translation
 */
export const useCreateTranslationUi = () => {
  return useMutation({
    mutationFn: translationsUiEndpoints.create,
    // No automatic invalidation - handled by caller
  });
};
