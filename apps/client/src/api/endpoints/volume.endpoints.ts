import { transformAxiosError } from '@workspace/core/api';
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
export const volumeEndpoints = {
  /**
   * Get all volumes with translations
   */
  getVolumes: async (): Promise<VolumeTranslation[]> => {
    try {
      const response = await api.get('/drink-volumes');
      const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
      return data.map(transformVolume);
    } catch (error) {
      throw transformAxiosError(error);
    }
  },

  /**
   * Update a volume with new translations
   */
  updateVolume: async (id: string, updates: VolumeUpdate): Promise<VolumeTranslation> => {
    try {
      const response = await api.patch(`/drink-volumes/${id}`, updates);
      const data = response.data?.data || response.data;
      return transformVolume(data);
    } catch (error) {
      throw transformAxiosError(error);
    }
  },
} as const;
