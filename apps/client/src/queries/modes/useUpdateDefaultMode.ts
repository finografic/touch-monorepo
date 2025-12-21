import { useMutation, useQueryClient } from '@tanstack/react-query';

import { modesEndpoints, type UpdateDefaultModeRequest } from 'api/endpoints';

/**
 * Hook to update which mode is the default
 */
export const useUpdateDefaultMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: modesEndpoints.updateDefault,
    onSuccess: () => {
      // Invalidate modes queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['modes'] });
    },
  });
};
