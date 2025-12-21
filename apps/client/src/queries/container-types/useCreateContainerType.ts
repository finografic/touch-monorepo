import { useMutation } from '@tanstack/react-query';

import { containerTypesEndpoints, type CreateContainerTypeInput } from 'api/endpoints';

/**
 * Hook to create a new container type
 */
export const useCreateContainerType = () => {
  return useMutation({
    mutationFn: containerTypesEndpoints.create,
    // No automatic invalidation - handled by caller
  });
};
