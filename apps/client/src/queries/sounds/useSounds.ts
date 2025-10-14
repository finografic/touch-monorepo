import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';
import { clearSoundCache } from 'utils/soundCache.utils';

// Types
export type SoundType = 'alarm' | 'finish';

export interface SoundFile {
  id: string;
  name: string;
  originalName?: string; // Optional: original filename for new uploads
  url: string;
  filePath?: string; // Actual server file path for direct access
  type: string;
  size: number;
  uploadedAt: string;
}

export interface SoundSettings {
  alarm: string | null;
  finish: string | null;
}

// API functions
export const getSoundFiles = async (soundType?: SoundType): Promise<SoundFile[]> => {
  const url = soundType ? `/sounds/${soundType}` : '/sounds';
  const response = await api.get(url);
  return response.data;
};

export const uploadSoundFiles = async (files: File[], soundType: SoundType): Promise<SoundFile[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await api.post(`/sounds/${soundType}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const removeSoundFile = async (id: string, soundType: SoundType): Promise<{ message: string }> => {
  const response = await api.delete(`/sounds/${soundType}/${id}`);
  return response.data;
};

export const getSoundSettings = async (): Promise<SoundSettings> => {
  const response = await api.get('/sounds/settings');
  return response.data;
};

export const updateSoundSettings = async (settings: SoundSettings): Promise<SoundSettings> => {
  const response = await api.put('/sounds/settings', settings);
  return response.data;
};

// React Query hooks
export const useGetSoundFiles = (soundType?: SoundType) => {
  return useQuery({
    queryKey: ['sounds', 'files', soundType],
    queryFn: () => getSoundFiles(soundType),
  });
};

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

export const useGetSoundSettings = () => {
  return useQuery({
    queryKey: ['sounds', 'settings'],
    queryFn: getSoundSettings,
  });
};

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
