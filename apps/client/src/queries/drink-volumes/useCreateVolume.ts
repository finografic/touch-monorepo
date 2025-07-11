import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';
import { transformAxiosError } from 'api/api.utils';
import { GET_DRINK_VOLUMES_QUERYKEY } from '.';
import type { DrinkVolume } from 'types/models/volume.model';
import { useContent } from 'providers/ContentProvider/ContentContext';
import { slugify } from 'utils/string.utils';

export interface CreateVolumeInput {
  name: string;
  valueInMl: number;
  sortOrder: number;
  coolingFactor?: number;
  translations?: Record<string, string>;
}

/**
 * Hook to create a new volume
 */
export const useCreateVolume = () => {
  const queryClient = useQueryClient();
  const { currentLanguage } = useContent();

  return useMutation({
    mutationFn: async (data: CreateVolumeInput): Promise<DrinkVolume> => {
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

        const response = await api.post('/drink-volumes', {
          name: kebabName, // Use kebab-case name for storage
          value_in_ml: data.valueInMl,
          sort_order: data.sortOrder,
          cooling_factor: data.coolingFactor || 1,
          translations,
        });
        const entity = response.data.data;
        return {
          id: entity.id,
          name: entity.name,
          valueInMl: entity.value_in_ml,
          sortOrder: entity.sort_order,
          coolingFactor: entity.cooling_factor,
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
      // Invalidate volumes query to refetch the list
      queryClient.invalidateQueries({ queryKey: GET_DRINK_VOLUMES_QUERYKEY });
    },
  });
};
