import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EndpointsVolume, type VolumeUpdate } from 'api/endpoints';

import type { DrinkVolume } from 'types/models/volume.model';
import { GET_VOLUMES_TRANSLATIONS_QUERYKEY } from '.';

export const useUpdateVolumeTranslations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: VolumeUpdate }) =>
      EndpointsVolume.update(id, updates),
    onSuccess: (updatedVolume) => {
      queryClient.setQueryData<DrinkVolume[]>(GET_VOLUMES_TRANSLATIONS_QUERYKEY, (oldData) => {
        if (!oldData) return [updatedVolume];
        return oldData.map((item) => (item.id === updatedVolume.id ? updatedVolume : item));
      });
    },
  });
};
