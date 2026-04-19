import { useQuery } from '@tanstack/react-query';
import { ImagesEndpoints } from 'api/endpoints';

import type { ImageSettings } from 'types/images.types';

export const useGetImageSettings = () => {
  return useQuery<ImageSettings>({
    queryKey: ['images', 'settings'],
    queryFn: ImagesEndpoints.getSettings,
  });
};
