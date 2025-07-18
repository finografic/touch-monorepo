import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

// Types
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
  tick: string | null;
  finish: string | null;
}

// API functions
export const getSoundFiles = async (): Promise<SoundFile[]> => {
  const response = await api.get('/sounds');
  log('__DEV: response', 'lime', response);
  return response.data;
};

export const uploadSoundFiles = async (files: File[]): Promise<SoundFile[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await api.post('/sounds/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const removeSoundFile = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/sounds/${id}`);
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
export const useGetSoundFiles = () => {
  return useQuery({
    queryKey: ['sounds', 'files'],
    queryFn: getSoundFiles,
  });
};

export const useUploadSoundFiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadSoundFiles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sounds', 'files'] });
    },
  });
};

export const useRemoveSoundFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeSoundFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sounds', 'files'] });
      queryClient.invalidateQueries({ queryKey: ['sounds', 'settings'] });
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
    },
  });
};
