import { useMutation } from '@tanstack/react-query';

import { EndpointsContainerTypes, type CreateContainerTypeInput } from 'api/endpoints';

/**
 * Hook to create a new container type
 */
export const useCreateContainerType = () => {
  return useMutation({
    mutationFn: EndpointsContainerTypes.create,
    // No automatic invalidation - handled by caller
  });
};
