import { transformFetchError } from '@workspace/core/api';

import { useMutation } from '@tanstack/react-query';
import { api } from 'api';

import type { TranslationsUiModel } from 'types/models/translations-ui.model';
import { TranslationsUiDto } from './translations-ui.dto';

export interface UpdateTranslationUiInput {
  key?: string;
  translations?: Record<string, string>;
  description?: string;
  isActive?: boolean;
}

/**
 * Hook to update an existing UI translation
 */
export const useUpdateTranslationUi = () => {
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateTranslationUiInput;
    }): Promise<TranslationsUiModel> => {
      try {
        const response = await api.patch<any>(`/translations-ui/${id}`, {
          key: updates.key,
          translations: updates.translations,
          description: updates.description,
          isActive: updates.isActive,
        });

        // Handle nested data structure if server returns { data: {...} }
        const entity = (response as any)?.data || response;

        // Transform using DTO to parse translations and normalize dates
        return TranslationsUiDto.fromApi(entity);
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    // No automatic invalidation - handled by caller
  });
};
