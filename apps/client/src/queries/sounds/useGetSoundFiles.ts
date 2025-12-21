import { useQuery } from '@tanstack/react-query';

import { soundsEndpoints } from 'api/endpoints';
import type { SoundFile, SoundType } from 'types/sounds.types';

/**
 * Get all sound files or filter by type
 */
export const useGetSoundFiles = (soundType?: SoundType) => {
  return useQuery<SoundFile[]>({
    queryKey: soundType ? ['sounds', soundType] : ['sounds'],
    queryFn: () => soundsEndpoints.getFiles(soundType),
  });
};
