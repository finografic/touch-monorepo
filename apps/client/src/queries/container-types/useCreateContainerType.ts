import { transformAxiosError } from '@workspace/core/api';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import { useAppConfig } from 'providers/AppConfigProvider';

import { slugify } from 'utils/string.utils';
import type { ContainerType } from 'types/models/container.model';
import { GET_CONTAINER_TYPES_QUERYKEY } from '.';

export interface CreateContainerTypeInput {
  name: string;
  thermalConductivity: number;
  translations?: Record<string, string>;
}

/**
 * Hook to create a new container type
 */
export const useCreateContainerType = () => {
  const queryClient = useQueryClient();
  const { currentLanguage } = useAppConfig();

  return useMutation({
    mutationFn: async (data: CreateContainerTypeInput): Promise<ContainerType> => {
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

        const response = await api.post('/container-types', {
          name: kebabName, // Use kebab-case name for storage
          thermalConductivity: data.thermalConductivity,
          translations,
        });

        // Handle both response structures:
        // - Direct: response.data = { id, name, ... }
        // - Wrapped: response.data = { data: { id, name, ... } }
        const entity = response.data?.data || response.data;

        if (!entity || !entity.id) {
          throw new Error('Invalid response: missing container type data');
        }

        return {
          id: entity.id,
          name: entity.name,
          thermalConductivity: entity.thermal_conductivity ?? entity.thermalConductivity,
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
    onSuccess: () => {
      // Invalidate and refetch container types query to update the list
      queryClient.invalidateQueries({ queryKey: GET_CONTAINER_TYPES_QUERYKEY });
      queryClient.refetchQueries({ queryKey: GET_CONTAINER_TYPES_QUERYKEY });
    },
  });
};
