import { useQuery } from '@tanstack/react-query';
import { api } from 'api';
import type { SoundFile, SoundType } from 'types/sounds.types';

// API function
export const getSoundFiles = async (soundType?: SoundType): Promise<SoundFile[]> => {
  const url = soundType ? `/sounds/${soundType}` : '/sounds';
  const response = await api.get(url);
  return response.data;
};

// React Query hook
export const useGetSoundFiles = (soundType?: SoundType) => {
  return useQuery({
    queryKey: ['sounds', 'files', soundType],
    queryFn: () => getSoundFiles(soundType),
  });
};
