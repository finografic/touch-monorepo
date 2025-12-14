import { transformFetchError } from '@workspace/core/api';

import { useMutation } from '@tanstack/react-query';
import { api } from 'api';

import { slugify } from 'utils/string.utils';
import type { ContainerType } from 'types/models/container.model';

export interface CreateContainerTypeInput {
  name: string;
  thermalConductivity: number;
  translations?: Record<string, string>;
}

/**
 * Hook to create a new container type
 */
export const useCreateContainerType = () => {
  return useMutation({
    mutationFn: async (data: CreateContainerTypeInput): Promise<ContainerType> => {
      try {
        // Convert display name to kebab-case for storage
        const kebabName = slugify(data.name);

        // Use provided translations directly (already contains correct display names)
        // Don't override with data.name - that's the slug, not the display name
        const translations = {
          'en-GB': '',
          'es-ES': '',
          'ca-ES': '',
          ...data.translations, // Use translations from DTO (contains actual display names)
        };

        // Fetch client returns data directly
        const response = await api.post<any>('/container-types', {
          name: kebabName, // Use kebab-case name for storage
          thermalConductivity: data.thermalConductivity,
          translations,
        });

        // Handle both response structures:
        // - Direct: response = { id, name, ... }
        // - Wrapped: response = { data: { id, name, ... } }
        const entity = response?.data || response;

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
        throw transformFetchError(error);
      }
    },
    // No automatic invalidation - handled by caller
  });
};
