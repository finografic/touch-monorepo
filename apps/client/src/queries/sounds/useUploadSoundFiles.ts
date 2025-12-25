import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SoundsEndpoints } from 'api/endpoints';
import type { SoundType } from 'types/sounds.types';

/**
 * Upload sound files
 */
export const useUploadSoundFiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ soundType, formData }: { soundType: SoundType; formData: FormData }) =>
      SoundsEndpoints.uploadFiles(soundType, formData),
    onSuccess: (_, { soundType }) => {
      queryClient.invalidateQueries({ queryKey: ['sounds', soundType] });
      queryClient.invalidateQueries({ queryKey: ['sounds'] });
    },
  });
};
