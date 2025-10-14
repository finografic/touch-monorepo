import { useQuery } from '@tanstack/react-query';
import { api } from 'api';
import type { SoundSettings } from 'types/sounds.types';

// API function
export const getSoundSettings = async (): Promise<SoundSettings> => {
  const response = await api.get('/sounds/settings');
  return response.data;
};

// React Query hook
export const useGetSoundSettings = () => {
  return useQuery({
    queryKey: ['sounds', 'settings'],
    queryFn: getSoundSettings,
  });
};
