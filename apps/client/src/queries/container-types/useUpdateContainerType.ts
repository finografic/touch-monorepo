import { transformFetchError } from '@workspace/core/api';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import type { ContainerType } from 'types/models/container.model';
import {
  GET_CONTAINER_TYPES_QUERYKEY,
  POST_CONTAINER_TYPE_QUERYKEY,
  PATCH_CONTAINER_TYPE_QUERYKEY,
  DELETE_CONTAINER_TYPE_QUERYKEY,
} from '.';

export interface UpdateContainerTypeInput {
  translations?: Record<string, string>;
  thermalConductivity?: number;
  isActive?: boolean;
}

/**
 * Hook to update an existing container type
 */
export const useUpdateContainerType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateContainerTypeInput;
    }): Promise<ContainerType> => {
      try {
        const response = await api.patch<any>(`/container-types/${id}`, {
          translations: updates.translations,
          thermalConductivity: updates.thermalConductivity,
          isActive: updates.isActive,
        });

        // Handle nested data structure if server returns { data: {...} }
        const entity = (response as any)?.data || response;

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
    onSuccess: () => {
      // Invalidate ALL container-types query keys to ensure fresh data
      queryClient.invalidateQueries({ queryKey: GET_CONTAINER_TYPES_QUERYKEY });
      queryClient.invalidateQueries({ queryKey: POST_CONTAINER_TYPE_QUERYKEY });
      queryClient.invalidateQueries({ queryKey: PATCH_CONTAINER_TYPE_QUERYKEY });
      queryClient.invalidateQueries({ queryKey: DELETE_CONTAINER_TYPE_QUERYKEY });
    },
  });
};

