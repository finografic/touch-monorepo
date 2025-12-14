import { transformFetchError } from '@workspace/core/api';

import { useMutation } from '@tanstack/react-query';
import { api } from 'api';
import type { DrinkTypeEntity } from '@workspace/server/types';

import { slugify } from 'utils/string.utils';
import type { DrinkType } from 'types/models/drink-type.model';
import { DrinkTypeDTO } from './DrinkTypes.dto';

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

  return useMutation({
    mutationFn: async (data: CreateDrinkTypeInput): Promise<DrinkType> => {
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
        const response = await api.post<any>('/drink-types', {
          name: kebabName, // Use kebab-case name for storage
          hasSubtypes: data.hasSubtypes ? 1 : 0,
          defaultTempConsume: data.defaultTempConsume || 5,
          defaultTempFreeze: data.defaultTempFreeze || -2,
          translations,
        });

        // Server may return { data: entity } or entity directly
        // Check both structures to handle either case
        const entity = response?.data || response;

        if (!entity || !entity.id) {
          console.error('Invalid response structure:', response);
          throw new Error('Invalid response from server: missing drink type data');
        }

        return {
          id: entity.id,
          name: entity.name,
          hasSubtypes: Boolean(entity.has_subtypes ?? entity.hasSubtypes),
          defaultTempConsume: entity.default_temp_consume ?? entity.defaultTempConsume,
          defaultTempFreeze: entity.default_temp_freeze ?? entity.defaultTempFreeze,
          isActive: Boolean(entity.is_active ?? entity.isActive ?? true),
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
