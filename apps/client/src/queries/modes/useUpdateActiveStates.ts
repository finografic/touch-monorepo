import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ModesEndpoints } from 'api/endpoints';

/**
 * Hook to update active states of multiple modes
 */
export const useUpdateActiveStates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ModesEndpoints.updateActiveStates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modes'] });
    },
  });
};
