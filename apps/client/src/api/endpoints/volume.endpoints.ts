import { transformFetchError } from '@workspace/core/api';

import { api } from 'api';
import type { DrinkVolume } from 'types/models/volume.model';

export type VolumeUpdate = Partial<Omit<DrinkVolume, 'id'>>;

export const EndpointsVolume = {
  getAll: async (): Promise<DrinkVolume[]> => {
    try {
      const data = await api.get<DrinkVolume[]>('/drink-volumes');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  getById: async (id: string): Promise<DrinkVolume> => {
    try {
      return await api.get<DrinkVolume>(`/drink-volumes/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  update: async (id: string, updates: VolumeUpdate): Promise<DrinkVolume> => {
    try {
      return await api.patch<DrinkVolume>(`/drink-volumes/${id}`, updates);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  create: async (updates: VolumeUpdate): Promise<DrinkVolume> => {
    try {
      return await api.post<DrinkVolume>('/drink-volumes', updates);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete<void>(`/drink-volumes/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
