import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImagesEndpoints } from 'api/endpoints';

export const useUpdateImageSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ImagesEndpoints.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
};
