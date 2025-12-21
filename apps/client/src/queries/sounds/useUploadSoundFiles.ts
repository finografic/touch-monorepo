import { useMutation, useQueryClient } from '@tanstack/react-query';

import { soundsEndpoints } from 'api/endpoints';
import type { SoundType } from 'types/sounds.types';

/**
 * Upload sound files
 */
export const useUploadSoundFiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ soundType, formData }: { soundType: SoundType; formData: FormData }) =>
      soundsEndpoints.uploadFiles(soundType, formData),
    onSuccess: (_, { soundType }) => {
      // Invalidate sound files query for this type
      queryClient.invalidateQueries({ queryKey: ['sounds', soundType] });
      queryClient.invalidateQueries({ queryKey: ['sounds'] });
    },
  });
};
