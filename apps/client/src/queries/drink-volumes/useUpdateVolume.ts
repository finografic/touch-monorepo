import { useMutation } from '@tanstack/react-query';

import { EndpointsVolume, type VolumeUpdate } from 'api/endpoints';
import type { DrinkVolume } from 'types/models/volume.model';

export interface UpdateVolumeInput {
  name?: string;
  translations?: Record<string, string>;
  valueInMl?: number;
  sortOrder?: number;
  coolingFactor?: number;
  isActive?: boolean;
}

export const useUpdateVolume = () => {
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateVolumeInput }): Promise<DrinkVolume> => {
      return EndpointsVolume.update(id, updates);
    },
  });
};
