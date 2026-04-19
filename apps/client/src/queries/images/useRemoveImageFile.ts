import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImagesEndpoints } from 'api/endpoints';

import type { ImageCategory } from 'types/images.types';

export const useRemoveImageFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ category, id }: { category: ImageCategory; id: string }) =>
      ImagesEndpoints.removeFile(category, id),
    onSuccess: (_, { category }) => {
      queryClient.invalidateQueries({ queryKey: ['images', category] });
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['images', 'settings'] });
    },
  });
};
