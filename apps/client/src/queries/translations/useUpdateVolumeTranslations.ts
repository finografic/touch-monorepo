import { useMutation, useQueryClient } from '@tanstack/react-query';

import { volumeEndpoints, type VolumeTranslation, type VolumeUpdate } from 'api/endpoints';
import { GET_VOLUMES_TRANSLATIONS_QUERYKEY } from '.';

/**
 * Update volume translations
 */
export const useUpdateVolumeTranslations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: VolumeUpdate }) =>
      volumeEndpoints.updateVolume(id, updates),
    onSuccess: (updatedVolume) => {
      // Update the cache with the new data
      queryClient.setQueryData<VolumeTranslation[]>(GET_VOLUMES_TRANSLATIONS_QUERYKEY, (oldData) => {
        if (!oldData) return [updatedVolume];
        return oldData.map((item) => (item.id === updatedVolume.id ? updatedVolume : item));
      });
    },
  });
};

