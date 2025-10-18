import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transformAxiosError } from '@workspace/core/api';
import { api } from 'api';

import type { DrinkType } from 'types/models/drink-type.model';

import { GET_DRINK_TYPES_QUERYKEY } from '.';

export interface UpdateDrinkTypeInput {
  hasSubtypes?: boolean;
  defaultTempConsume?: number;
  defaultTempFreeze?: number;
  translations?: Record<string, string>;
}

/**
 * Hook to update a drink type
 */
export const useUpdateDrinkType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateDrinkTypeInput;
    }): Promise<DrinkType> => {
      try {
        const response = await api.patch(`/drink-types/${id}`, {
          hasSubtypes: updates.hasSubtypes ? 1 : 0,
          defaultTempConsume: updates.defaultTempConsume,
          defaultTempFreeze: updates.defaultTempFreeze,
          translations: updates.translations,
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
