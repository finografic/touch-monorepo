import { transformFetchError } from '@workspace/core/api';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import type { DrinkVolume } from 'types/models/volume.model';
import {
  GET_DRINK_VOLUMES_QUERYKEY,
  POST_DRINK_VOLUME_QUERYKEY,
  PATCH_DRINK_VOLUME_QUERYKEY,
  DELETE_DRINK_VOLUME_QUERYKEY,
} from '.';

export interface UpdateVolumeInput {
  translations?: Record<string, string>;
  valueInMl?: number;
  sortOrder?: number;
  coolingFactor?: number;
  isActive?: boolean;
}

/**
 * Hook to update an existing volume
 */
export const useUpdateVolume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateVolumeInput;
    }): Promise<DrinkVolume> => {
      try {
        const response = await api.patch<any>(`/drink-volumes/${id}`, {
          translations: updates.translations,
          valueInMl: updates.valueInMl,
          sortOrder: updates.sortOrder,
          coolingFactor: updates.coolingFactor,
          isActive: updates.isActive,
        });

        // Handle nested data structure if server returns { data: {...} }
        const entity = (response as any)?.data || response;

        return {
          id: entity.id,
          name: entity.name,
          valueInMl: entity.value_in_ml ?? entity.valueInMl,
          sortOrder: entity.sort_order ?? entity.sortOrder,
          coolingFactor: entity.cooling_factor ?? entity.coolingFactor,
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
    onSuccess: () => {
      // Invalidate ALL drink-volumes query keys to ensure fresh data
      queryClient.invalidateQueries({ queryKey: GET_DRINK_VOLUMES_QUERYKEY });
      queryClient.invalidateQueries({ queryKey: POST_DRINK_VOLUME_QUERYKEY });
      queryClient.invalidateQueries({ queryKey: PATCH_DRINK_VOLUME_QUERYKEY });
      queryClient.invalidateQueries({ queryKey: DELETE_DRINK_VOLUME_QUERYKEY });
    },
  });
};

