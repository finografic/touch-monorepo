import { transformFetchError } from '@workspace/core/api';

import { api } from 'api';

// Types for volume translations
export interface VolumeTranslation {
  id: string;
  name: string;
  translations: Record<string, string>; // Dynamic translations from JSON
  isActive?: boolean;
}

export type VolumeUpdate = Partial<Omit<VolumeTranslation, 'id'>>;

/**
 * Helper to transform server response to frontend format using JSON translations
 */
const transformVolume = (serverData: any): VolumeTranslation => ({
  id: serverData.id,
  name: serverData.name,
  translations: serverData.translations || {}, // Use JSON translations directly
  isActive: serverData.isActive ?? serverData.is_active ?? true,
});

/**
 * Volume API endpoints
 */
export const EndpointsVolume = {
  /**
   * Get all volumes with translations
   */
  getVolumes: async (): Promise<VolumeTranslation[]> => {
    try {
      // Fetch client returns data directly
      const data = await api.get<any[]>('/drink-volumes');
      const volumesArray = Array.isArray(data) ? data : [];
      return volumesArray.map(transformVolume);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Update a volume with new translations
   */
  updateVolume: async (id: string, updates: VolumeUpdate): Promise<VolumeTranslation> => {
    try {
      // Fetch client returns data directly
      const data = await api.patch<any>(`/drink-volumes/${id}`, updates);
      return transformVolume(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
