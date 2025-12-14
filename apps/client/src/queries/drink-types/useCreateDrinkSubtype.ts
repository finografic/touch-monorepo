import { transformFetchError } from '@workspace/core/api';

import { useMutation } from '@tanstack/react-query';
import { api } from 'api';

import { slugify } from 'utils/string.utils';
import type { DrinkSubtype } from 'types/models/drink-type.model';

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

  return useMutation({
    mutationFn: async (data: CreateDrinkSubtypeInput): Promise<DrinkSubtype> => {
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
        const response = await api.post<any>(`/drink-types/${data.drinkTypeId}/subtypes`, {
          name: kebabName, // Use kebab-case name for storage
          defaultTempConsume: data.defaultTempConsume || 5,
          defaultTempFreeze: data.defaultTempFreeze || -2,
          translations,
        });

        // Handle both response structures:
        // - Direct: response = { id, name, ... }
        // - Wrapped: response = { data: { id, name, ... } }
        const entity = response?.data || response;

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
        throw transformFetchError(error);
      }
    },
    // No automatic invalidation - handled by caller
  });
};
