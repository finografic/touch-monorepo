import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EndpointsMode } from 'api/endpoints';

/**
 * Hook to update active states of multiple modes
 */
export const useUpdateActiveStates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: EndpointsMode.updateActiveStates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modes'] });
    },
  });
};
