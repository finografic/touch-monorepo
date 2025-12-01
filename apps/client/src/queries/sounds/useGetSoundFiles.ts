import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

import type { SoundFile, SoundType } from 'types/sounds.types';

// API function
export const getSoundFiles = async (soundType?: SoundType): Promise<SoundFile[]> => {
  const url = soundType ? `/sounds/${soundType}` : '/sounds';
  // Fetch client returns data directly
  return await api.get<SoundFile[]>(url);
};

// React Query hook
export const useGetSoundFiles = (soundType?: SoundType) => {
  return useQuery({
    queryKey: ['sounds', 'files', soundType],
    queryFn: () => getSoundFiles(soundType),
  });
};
