import { useMutation } from '@tanstack/react-query';

import { containerTypesEndpoints, type UpdateContainerTypeInput } from 'api/endpoints';

/**
 * Hook to update an existing container type
 */
export const useUpdateContainerType = () => {
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateContainerTypeInput }) =>
      containerTypesEndpoints.update(id, updates),
    // No automatic invalidation - handled by caller
  });
};
