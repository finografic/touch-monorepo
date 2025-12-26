import { transformFetchError } from '@workspace/core/api';

import { api } from 'api';
import type {
  SupportedLanguageInput,
  SupportedLanguageUpdate,
} from 'queries/supported-languages/supported-languages.types';
import type { SupportedLanguage } from 'types/models/supported-language.model';

// ============================================================================
// ENDPOINTS
// ============================================================================

/**
 * Supported Languages API endpoints
 *
 * Manages language configurations for the application.
 */
export const EndpointsSupportedLanguages = {
  /**
   * Get all supported languages
   */
  getAll: async (): Promise<SupportedLanguage[]> => {
    try {
      return await api.get<SupportedLanguage[]>('/supported-languages');
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Get all supported languages (alias for EndpointHelper compatibility)
   */
  getSupportedLanguages: async (): Promise<SupportedLanguage[]> => {
    return EndpointsSupportedLanguages.getAll();
  },

  /**
   * Get a single supported language by ID
   */
  getById: async (id: string): Promise<SupportedLanguage> => {
    try {
      return await api.get<SupportedLanguage>(`/supported-languages/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Get a single supported language (alias for EndpointHelper compatibility)
   */
  getSupportedLanguage: async (id: string): Promise<SupportedLanguage> => {
    return EndpointsSupportedLanguages.getById(id);
  },

  /**
   * Create a new supported language
   */
  create: async (data: SupportedLanguageInput): Promise<SupportedLanguage> => {
    try {
      return await api.post<SupportedLanguage>('/supported-languages', data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Create a new supported language (alias for EndpointHelper compatibility)
   */
  createSupportedLanguage: async (data: SupportedLanguageInput): Promise<SupportedLanguage> => {
    return EndpointsSupportedLanguages.create(data);
  },

  /**
   * Update an existing supported language
   */
  update: async (id: string, data: SupportedLanguageUpdate): Promise<SupportedLanguage> => {
    try {
      return await api.patch<SupportedLanguage>(`/supported-languages/${id}`, data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Update an existing supported language (alias for EndpointHelper compatibility)
   */
  updateSupportedLanguage: async (id: string, data: SupportedLanguageUpdate): Promise<SupportedLanguage> => {
    return EndpointsSupportedLanguages.update(id, data);
  },

  /**
   * Delete a supported language
   */
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete<void>(`/supported-languages/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Delete a supported language (alias for EndpointHelper compatibility)
   */
  deleteSupportedLanguage: async (id: string): Promise<void> => {
    return EndpointsSupportedLanguages.delete(id);
  },
} as const;
