import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transformAxiosError } from '@workspace/core/api';
import { api } from 'api';

import { useAppConfig } from 'providers/AppConfigProvider';

import type { DrinkSubtype } from 'types/models/drink-type.model';
import { slugify } from 'utils/string.utils';

import { GET_DRINK_TYPES_QUERYKEY } from '.';

export interface CreateDrinkSubtypeInput {
  name: string;
  drinkTypeId: string;
  defaultTempConsume?: number;
  defaultTempFreeze?: number;
  translations?: Record<string, string>;
}

/**
 * Hook to create a new drink subtype
 */
export const useCreateDrinkSubtype = () => {
  const queryClient = useQueryClient();
  const { currentLanguage } = useAppConfig();

  return useMutation({
    mutationFn: async (data: CreateDrinkSubtypeInput): Promise<DrinkSubtype> => {
      try {
        // Convert display name to kebab-case for storage
        const kebabName = slugify(data.name);

        // Create translations object with current language
        const translations = {
          'en-GB': '', // Empty string for other languages
          'es-ES': '',
          'ca-ES': '',
          ...data.translations, // Allow overriding with provided translations
          [currentLanguage]: data.name, // Use original name for current language (overrides empty string)
        };

        const response = await api.post(`/drink-types/${data.drinkTypeId}/subtypes`, {
          name: kebabName, // Use kebab-case name for storage
          defaultTempConsume: data.defaultTempConsume || 5,
          defaultTempFreeze: data.defaultTempFreeze || -2,
          translations,
        });
        const entity = response.data.data;
        return {
          id: entity.id,
          name: entity.name,
          drinkTypeId: entity.drink_type_id,
          defaultTempConsume: entity.default_temp_consume,
          defaultTempFreeze: entity.default_temp_freeze,
          isActive: Boolean(entity.is_active),
          createdAt: new Date(entity.created_at * 1000),
          updatedAt: new Date(entity.updated_at * 1000),
          translations: entity.translations || {},
        };
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    onSuccess: () => {
      // Invalidate drink types query to refetch the list
      queryClient.invalidateQueries({ queryKey: GET_DRINK_TYPES_QUERYKEY });
    },
  });
};
