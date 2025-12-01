import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import type { SoundFile, SoundType } from 'types/sounds.types';

// API function
export const uploadSoundFiles = async (files: File[], soundType: SoundType): Promise<SoundFile[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  // Fetch client returns data directly
  // Note: Don't set Content-Type header for FormData - browser will set it with boundary automatically
  return await api.post<SoundFile[]>(`/sounds/${soundType}/upload`, formData);
};

// React Query hook
export const useUploadSoundFiles = (soundType: SoundType) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: File[]) => uploadSoundFiles(files, soundType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sounds', 'files', soundType] });
      queryClient.invalidateQueries({ queryKey: ['sounds', 'files'] }); // Also invalidate general files
    },
  });
};
