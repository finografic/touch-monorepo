import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import { clearSoundCache } from 'utils/soundCache.utils';
import type { SoundType } from 'types/sounds.types';

// API function
export const removeSoundFile = async (id: string, soundType: SoundType): Promise<{ message: string }> => {
  // Fetch client returns data directly
  return await api.delete<{ message: string }>(`/sounds/${soundType}/${id}`);
};

// React Query hook
export const useRemoveSoundFile = (soundType: SoundType) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeSoundFile(id, soundType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sounds', 'files', soundType] });
      queryClient.invalidateQueries({ queryKey: ['sounds', 'files'] }); // Also invalidate general files
      queryClient.invalidateQueries({ queryKey: ['sounds', 'settings'] });
      clearSoundCache(); // Clear custom sound cache to prevent stale entries
    },
  });
};
