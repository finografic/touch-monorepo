import { useMutation } from '@tanstack/react-query';

import { translationsUiEndpoints, type UpdateTranslationUiInput } from 'api/endpoints';

/**
 * Hook to update an existing UI translation
 */
export const useUpdateTranslationUi = () => {
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTranslationUiInput }) =>
      translationsUiEndpoints.update(id, updates),
    // No automatic invalidation - handled by caller
  });
};
