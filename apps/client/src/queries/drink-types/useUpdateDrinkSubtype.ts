import { transformFetchError } from '@workspace/core/api';

import { useMutation } from '@tanstack/react-query';

import type { DrinkSubtype } from 'types/models/drink-type.model';
import { drinkSubtypeEndpoints } from 'api/endpoints/drink-subtype.endpoints';

export interface UpdateDrinkSubtypeInput {
  name?: string;
  translations?: Record<string, string>;
  defaultTempConsume?: number;
  defaultTempFreeze?: number;
}

/**
 * Hook to update a drink subtype
 * Uses the drinkSubtypeEndpoints.updateDrinkSubtype method
 */
export const useUpdateDrinkSubtype = () => {
  return useMutation({
    mutationFn: async ({
      id,
      drinkTypeId,
      updates,
    }: {
      id: string;
      drinkTypeId: string;
      updates: UpdateDrinkSubtypeInput;
    }): Promise<DrinkSubtype> => {
      try {
        const result = await drinkSubtypeEndpoints.updateDrinkSubtype(id, updates, drinkTypeId);

        // Transform to match DrinkSubtype model
        return {
          id: result.id,
          name: result.name,
          drinkTypeId: result.drinkTypeId,
          defaultTempConsume: (result as any).defaultTempConsume ?? 5,
          defaultTempFreeze: (result as any).defaultTempFreeze ?? -2,
          isActive: result.isActive ?? true,
          createdAt: new Date(), // API doesn't return these, use current time
          updatedAt: new Date(),
          translations: result.translations || {},
        } as DrinkSubtype;
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    // No automatic invalidation - handled by caller
  });
};

