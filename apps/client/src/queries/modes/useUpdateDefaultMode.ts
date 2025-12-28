import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EndpointsMode, type UpdateDefaultModeRequest } from 'api/endpoints';

/**
 * Hook to update which mode is the default
 */
export const useUpdateDefaultMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: EndpointsMode.updateDefault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modes'] });
    },
  });
};
