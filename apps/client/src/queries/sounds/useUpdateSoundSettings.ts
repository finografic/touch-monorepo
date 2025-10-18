import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import type { SoundSettings } from 'types/sounds.types';
import { clearSoundCache } from 'utils/soundCache.utils';

// API function
export const updateSoundSettings = async (settings: SoundSettings): Promise<SoundSettings> => {
  const response = await api.put('/sounds/settings', settings);
  return response.data;
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
