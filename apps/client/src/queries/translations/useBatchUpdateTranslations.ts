import { useMutation, useQueryClient } from '@tanstack/react-query';
import { batchTranslationEndpoints } from 'api/batch/batch-translations';

import { GET_ALL_TRANSLATIONS_QUERYKEY } from '.';

/**
 * Batch update all translations
 */
export const useBatchUpdateTranslations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: batchTranslationEndpoints.batchUpdateTranslations,
    onSuccess: () => {
      // Invalidate all translation queries to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: GET_ALL_TRANSLATIONS_QUERYKEY,
      });
    },
  });
};
