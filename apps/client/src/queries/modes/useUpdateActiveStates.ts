import { useMutation, useQueryClient } from '@tanstack/react-query';

import { modesEndpoints, type UpdateActiveStatesRequest } from 'api/endpoints';

/**
 * Hook to update active states of multiple modes
 */
export const useUpdateActiveStates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: modesEndpoints.updateActiveStates,
    onSuccess: () => {
      // Invalidate modes queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['modes'] });
    },
  });
};
