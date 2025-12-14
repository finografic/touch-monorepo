import { transformFetchError } from '@workspace/core/api';

import { useMutation } from '@tanstack/react-query';
import { api } from 'api';

import type { DrinkType } from 'types/models/drink-type.model';

export interface UpdateDrinkTypeInput {
  name: string;
  hasSubtypes?: boolean;
  defaultTempConsume?: number;
  defaultTempFreeze?: number;
  translations?: Record<string, string>;
}

/**
 * Hook to update a drink type
 */
export const useUpdateDrinkType = () => {
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateDrinkTypeInput;
    }): Promise<DrinkType> => {
      try {
        // Fetch client returns data directly
        const response = await api.patch<{ data: any }>(`/drink-types/${id}`, {
          name: updates.name,
          hasSubtypes: updates.hasSubtypes ? 1 : 0,
          defaultTempConsume: updates.defaultTempConsume,
          defaultTempFreeze: updates.defaultTempFreeze,
          translations: updates.translations,
        });
        // Handle nested data structure if server returns { data: {...} }
        const entity = (response as any)?.data || response;
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
        throw transformFetchError(error);
      }
    },
    // No automatic invalidation - handled by caller
  });
};
