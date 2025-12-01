import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

import type { SoundSettings } from 'types/sounds.types';

// API function
export const getSoundSettings = async (): Promise<SoundSettings> => {
  // Fetch client returns data directly
  return await api.get<SoundSettings>('/sounds/settings');
};

// React Query hook
export const useGetSoundSettings = () => {
  return useQuery({
    queryKey: ['sounds', 'settings'],
    queryFn: getSoundSettings,
  });
};
