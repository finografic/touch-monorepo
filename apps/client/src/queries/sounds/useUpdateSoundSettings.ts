import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import { clearSoundCache } from 'utils/soundCache.utils';
import type { SoundSettings } from 'types/sounds.types';

// API function
export const updateSoundSettings = async (settings: SoundSettings): Promise<SoundSettings> => {
  // Fetch client returns data directly
  return await api.put<SoundSettings>('/sounds/settings', settings);
};

// React Query hook
export const useUpdateSoundSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSoundSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sounds', 'settings'] });
      clearSoundCache(); // Clear custom sound cache when settings change
    },
  });
};
