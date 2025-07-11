import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';
import { transformAxiosError } from 'api/api.utils';
import { GET_DRINK_TYPES_QUERYKEY } from '.';
import type { DrinkType } from 'types/models/drink-type.model';
import { DrinkTypeDTO } from './DrinkTypes.dto';
import { useContent } from 'providers/ContentProvider/ContentContext';
import { slugify } from 'utils/string.utils';

export interface CreateDrinkTypeInput {
  name: string;
  hasSubtypes?: boolean;
  defaultTempConsume?: number;
  defaultTempFreeze?: number;
  translations?: Record<string, string>;
}

/**
 * Hook to create a new drink type
 */
export const useCreateDrinkType = () => {
  const queryClient = useQueryClient();
  const { currentLanguage } = useContent();

  return useMutation({
    mutationFn: async (data: CreateDrinkTypeInput): Promise<DrinkType> => {
      try {
        // Convert display name to kebab-case for storage
        const kebabName = slugify(data.name);

        // Create translations object with current language
        const translations = {
          [currentLanguage]: data.name, // Use original name for current language
          'en-GB': '', // Empty string for other languages
          'es-ES': '',
          'ca-ES': '',
          ...data.translations, // Allow overriding with provided translations
        };

        const response = await api.post('/drink-types', {
          name: kebabName, // Use kebab-case name for storage
          has_subtypes: data.hasSubtypes ? 1 : 0,
          default_temp_consume: data.defaultTempConsume || 5,
          default_temp_freeze: data.defaultTempFreeze || -2,
          translations,
        });
        const entity = response.data.data;
        return {
          id: entity.id,
          name: entity.name,
          hasSubtypes: Boolean(entity.has_subtypes),
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
