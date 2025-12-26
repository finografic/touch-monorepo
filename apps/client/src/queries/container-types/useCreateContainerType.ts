import { useMutation } from '@tanstack/react-query';

import { EndpointsContainerType, type CreateContainerTypeInput } from 'api/endpoints';

/**
 * Hook to create a new container type
 */
export const useCreateContainerType = () => {
  return useMutation({
    mutationFn: EndpointsContainerType.create,
    // No automatic invalidation - handled by caller
  });
};
