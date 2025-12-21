import { useMutation, useQueryClient } from '@tanstack/react-query';

import { soundsEndpoints } from 'api/endpoints';
import type { SoundType } from 'types/sounds.types';

/**
 * Remove a sound file
 */
export const useRemoveSoundFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ soundType, id }: { soundType: SoundType; id: string }) =>
      soundsEndpoints.removeFile(soundType, id),
    onSuccess: (_, { soundType }) => {
      // Invalidate sound files query for this type
      queryClient.invalidateQueries({ queryKey: ['sounds', soundType] });
      queryClient.invalidateQueries({ queryKey: ['sounds'] });
    },
  });
};
