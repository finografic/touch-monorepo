import { useQuery } from '@tanstack/react-query';
import { ImagesEndpoints } from 'api/endpoints';

import type { ImageCategory, ImageFile } from 'types/images.types';

export const useGetImageFiles = (category?: ImageCategory) => {
  return useQuery<ImageFile[]>({
    queryKey: category ? ['images', category] : ['images'],
    queryFn: () => ImagesEndpoints.getFiles(category),
  });
};
