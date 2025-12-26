import { useMutation } from '@tanstack/react-query';

import { EndpointsVolume, type VolumeUpdate } from 'api/endpoints';
import type { DrinkVolume } from 'types/models/volume.model';

export interface CreateVolumeInput {
  name: string;
  valueInMl: number;
  sortOrder: number;
  coolingFactor?: number;
  translations?: Record<string, string>;
}

export const useCreateVolume = () => {
  return useMutation({
    mutationFn: async (data: CreateVolumeInput): Promise<DrinkVolume> => {
      const updates: VolumeUpdate = {
        name: data.name,
        valueInMl: data.valueInMl,
        sortOrder: data.sortOrder,
        coolingFactor: data.coolingFactor ?? 1,
        translations: data.translations || {},
      };
      return EndpointsVolume.create(updates);
    },
  });
};
