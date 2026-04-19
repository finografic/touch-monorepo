import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImagesEndpoints } from 'api/endpoints';

import type { ImageCategory } from 'types/images.types';

export const useUploadImageFiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ category, formData }: { category: ImageCategory; formData: FormData }) =>
      ImagesEndpoints.uploadFiles(category, formData),
    onSuccess: (_, { category }) => {
      queryClient.invalidateQueries({ queryKey: ['images', category] });
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
};
