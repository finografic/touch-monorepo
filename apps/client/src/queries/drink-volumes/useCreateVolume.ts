import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transformAxiosError } from '@workspace/core/api';
import { api } from 'api';

import { useAppConfig } from 'providers/AppConfigProvider';
import type { DrinkVolume } from 'types/models/volume.model';
import { slugify } from 'utils/string.utils';
import { GET_DRINK_VOLUMES_QUERYKEY } from '.';

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
  const { currentLanguage } = useAppConfig();

  return useMutation({
    mutationFn: async (data: CreateVolumeInput): Promise<DrinkVolume> => {
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

        const response = await api.post('/drink-volumes', {
          name: kebabName, // Use kebab-case name for storage
          valueInMl: data.valueInMl,
          sortOrder: data.sortOrder,
          coolingFactor: data.coolingFactor || 1,
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
