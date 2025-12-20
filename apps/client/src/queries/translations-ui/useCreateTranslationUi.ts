import { transformFetchError } from '@workspace/core/api';

import { useMutation } from '@tanstack/react-query';
import { api } from 'api';

import type { TranslationsUiModel } from 'types/models/translations-ui.model';
import { TranslationsDto } from './translations-ui.dto';

export interface CreateTranslationUiInput {
  key: string;
  translations: Record<string, string>;
  description?: string;
  isActive?: boolean;
}

/**
 * Hook to create a new UI translation
 */
export const useCreateTranslationUi = () => {
  return useMutation({
    mutationFn: async (data: CreateTranslationUiInput): Promise<TranslationsUiModel> => {
      try {
        // Fetch client returns data directly
        const response = await api.post<any>('/translations-ui', {
          key: data.key,
          translations: data.translations,
          description: data.description || null,
          isActive: data.isActive !== undefined ? data.isActive : true,
        });

        // Handle both response structures:
        // - Direct: response = { id, key, ... }
        // - Wrapped: response = { data: { id, key, ... } }
        const entity = response?.data || response;

        if (!entity || !entity.id) {
          throw new Error('Invalid response: missing translation data');
        }

        // Transform using DTO to parse translations and normalize dates
        return TranslationsDto.fromApi(entity);
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    // No automatic invalidation - handled by caller
  });
};
