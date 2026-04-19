import { transformFetchError } from '@workspace/core/api';

import { api } from 'api';

import type { ImageCategory, ImageFile, ImageSettings } from 'types/images.types';

export const ImagesEndpoints = {
  getFiles: async (category?: ImageCategory): Promise<ImageFile[]> => {
    try {
      const url = category ? `/images/${category}` : '/images';
      return await api.get<ImageFile[]>(url);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  getSettings: async (): Promise<ImageSettings> => {
    try {
      return await api.get<ImageSettings>('/images/settings');
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  updateSettings: async (settings: ImageSettings): Promise<ImageSettings> => {
    try {
      return await api.put<ImageSettings>('/images/settings', settings);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  uploadFiles: async (category: ImageCategory, formData: FormData): Promise<ImageFile[]> => {
    try {
      return await api.post<ImageFile[]>(`/images/${category}/upload`, formData);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  removeFile: async (category: ImageCategory, id: string): Promise<{ message: string }> => {
    try {
      return await api.delete<{ message: string }>(`/images/${category}/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
