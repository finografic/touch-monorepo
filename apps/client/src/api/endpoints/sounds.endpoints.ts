import { transformFetchError } from '@workspace/core/api';

import { api } from 'api';

import type { SoundFile, SoundSettings, SoundType } from 'types/sounds.types';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Input for updating sound settings
 */
export interface UpdateSoundSettingsInput {
  enabled?: boolean;
  volume?: number;
}

// ============================================================================
// ENDPOINTS
// ============================================================================

/**
 * Sounds API endpoints
 *
 * Manages sound files and audio settings for the application.
 */
export const SoundsEndpoints = {
  /**
   * Get all sound files or filter by type
   */
  getFiles: async (soundType?: SoundType): Promise<SoundFile[]> => {
    try {
      const url = soundType ? `/sounds/${soundType}` : '/sounds';
      return await api.get<SoundFile[]>(url);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Get sound settings
   */
  getSettings: async (): Promise<SoundSettings> => {
    try {
      return await api.get<SoundSettings>('/sounds/settings');
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Update sound settings
   */
  // updateSettings: async (settings: UpdateSoundSettingsInput): Promise<SoundSettings> => {
  updateSettings: async (settings: SoundSettings): Promise<SoundSettings> => {
    try {
      return await api.put<SoundSettings>('/sounds/settings', settings);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Upload sound files
   */
  uploadFiles: async (soundType: SoundType, formData: FormData): Promise<SoundFile[]> => {
    try {
      return await api.post<SoundFile[]>(`/sounds/${soundType}/upload`, formData);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Remove a sound file
   */
  removeFile: async (soundType: SoundType, id: string): Promise<{ message: string }> => {
    try {
      return await api.delete<{ message: string }>(`/sounds/${soundType}/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
