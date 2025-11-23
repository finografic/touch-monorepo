import { transformAxiosError } from '@workspace/core/api';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import { useAppConfig } from 'providers/AppConfigProvider';

import { slugify } from 'utils/string.utils';
import type { DrinkSubtype } from 'types/models/drink-type.model';
import { GET_DRINK_SUBTYPES_QUERYKEY, GET_DRINK_TYPES_QUERYKEY } from '.';

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

        // Handle both response structures:
        // - Direct: response.data = { id, name, ... }
        // - Wrapped: response.data = { data: { id, name, ... } }
        const entity = response.data?.data || response.data;

        if (!entity || !entity.id) {
          throw new Error('Invalid response: missing subtype data');
        }

        return {
          id: entity.id,
          name: entity.name,
          drinkTypeId: entity.drink_type_id || entity.drinkTypeId,
          defaultTempConsume: entity.default_temp_consume ?? entity.defaultTempConsume,
          defaultTempFreeze: entity.default_temp_freeze ?? entity.defaultTempFreeze,
          isActive: Boolean(entity.is_active ?? entity.isActive),
          createdAt: entity.created_at
            ? new Date(typeof entity.created_at === 'string' ? entity.created_at : entity.created_at * 1000)
            : new Date(),
          updatedAt: entity.updated_at
            ? new Date(typeof entity.updated_at === 'string' ? entity.updated_at : entity.updated_at * 1000)
            : new Date(),
          translations: entity.translations || {},
        };
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    onSuccess: (data) => {
      // Invalidate and refetch drink types query to update the list
      queryClient.invalidateQueries({ queryKey: GET_DRINK_TYPES_QUERYKEY });
      queryClient.refetchQueries({ queryKey: GET_DRINK_TYPES_QUERYKEY });
      // Invalidate and refetch subtypes query for the specific drink type to include the new subtype
      queryClient.invalidateQueries({
        queryKey: [...GET_DRINK_SUBTYPES_QUERYKEY, data.drinkTypeId]
      });
      queryClient.refetchQueries({
        queryKey: [...GET_DRINK_SUBTYPES_QUERYKEY, data.drinkTypeId]
      });
    },
  });
};
