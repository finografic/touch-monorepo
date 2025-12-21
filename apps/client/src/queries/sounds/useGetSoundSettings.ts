import { useQuery } from '@tanstack/react-query';

import { soundsEndpoints } from 'api/endpoints';
import type { SoundSettings } from 'types/sounds.types';

/**
 * Get sound settings
 */
export const useGetSoundSettings = () => {
  return useQuery<SoundSettings>({
    queryKey: ['sounds', 'settings'],
    queryFn: soundsEndpoints.getSettings,
  });
};
