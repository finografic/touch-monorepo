import { useMutation, useQueryClient } from '@tanstack/react-query';

import { containerTypesEndpoints, type ContainerType, type UpdateContainerTypeInput } from 'api/endpoints';
import { GET_CONTAINER_TYPES_TRANSLATIONS_QUERYKEY } from '.';

/**
 * Update container type translations
 */
export const useUpdateContainerTypeTranslations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateContainerTypeInput }) =>
      containerTypesEndpoints.update(id, updates),
    onSuccess: (updatedContainerType) => {
      // Update the cache with the new data
      queryClient.setQueryData<ContainerType[]>(
        GET_CONTAINER_TYPES_TRANSLATIONS_QUERYKEY,
        (oldData) => {
          if (!oldData) return [updatedContainerType];
          return oldData.map((item) =>
            item.id === updatedContainerType.id ? updatedContainerType : item,
          );
        },
      );
    },
  });
};

