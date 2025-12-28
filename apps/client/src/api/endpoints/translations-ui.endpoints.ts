import { transformFetchError } from '@workspace/core/api';

import { api } from 'api';

// Import the existing DTO for transformations
import { TranslationsDto } from 'queries/translations-ui/translations-ui.dto';

import type { TranslationsModel } from 'types/models/translations.model';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Input type for creating a UI translation
 */
export interface CreateTranslationUiInput {
  key: string;
  translations: Record<string, string>;
  description?: string;
  isActive?: boolean;
}

/**
 * Input type for updating a UI translation
 */
export interface UpdateTranslationUiInput {
  key?: string;
  translations?: Record<string, string>;
  description?: string;
  isActive?: boolean;
}

// ============================================================================
// ENDPOINTS
// ============================================================================

/**
 * Translations UI API endpoints
 *
 * All server communication for UI translations (labels, buttons, etc.).
 * Uses TranslationsDto for consistent transformation logic.
 */
export const translationsUiEndpoints = {
  /**
   * Get all UI translations
   */
  getAll: async (): Promise<TranslationsModel[]> => {
    try {
      const data = await api.get<any[]>('/translations-ui');
      // Transform each entity using DTO to parse translations and normalize dates
      return Array.isArray(data) ? data.map((entity) => TranslationsDto.fromApi(entity)) : [];
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Get a single UI translation by ID
   */
  getById: async (id: string): Promise<TranslationsModel> => {
    try {
      const data = await api.get<any>(`/translations-ui/${id}`);
      return TranslationsDto.fromApi(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Create a new UI translation
   */
  create: async (input: CreateTranslationUiInput): Promise<TranslationsModel> => {
    try {
      const data = await api.post<any>('/translations-ui', {
        key: input.key,
        translations: input.translations,
        description: input.description || null,
        isActive: input.isActive !== undefined ? input.isActive : true,
      });

      return TranslationsDto.fromApi(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Update an existing UI translation
   */
  update: async (id: string, input: UpdateTranslationUiInput): Promise<TranslationsModel> => {
    try {
      const data = await api.patch<any>(`/translations-ui/${id}`, input);
      return TranslationsDto.fromApi(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Delete a UI translation
   */
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete<void>(`/translations-ui/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
