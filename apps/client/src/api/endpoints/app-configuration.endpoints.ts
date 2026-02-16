import { transformFetchError } from '@workspace/core/api';

import { api } from 'api';

import type { AppConfiguration, UpdateAppConfigurationRequest } from 'types/app-configuration.types';

// ============================================================================
// ENDPOINTS
// ============================================================================

/**
 * App Configuration API endpoints.
 * Key/value store for app-level config (e.g. grid_layout mode).
 */
export const appConfigurationEndpoints = {
  /**
   * Get all app configuration entries
   */
  getAll: async (): Promise<AppConfiguration[]> => {
    try {
      return await api.get<AppConfiguration[]>('/app-configuration');
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Get one app configuration by id
   */
  getById: async (id: string): Promise<AppConfiguration> => {
    try {
      return await api.get<AppConfiguration>(`/app-configuration/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Get one app configuration by key (name)
   */
  getByKey: async (name: string): Promise<AppConfiguration> => {
    try {
      return await api.get<AppConfiguration>(`/app-configuration/key/${encodeURIComponent(name)}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Update an app configuration (partial update)
   */
  update: async (id: string, data: UpdateAppConfigurationRequest): Promise<AppConfiguration> => {
    try {
      return await api.patch<AppConfiguration>(`/app-configuration/${id}`, data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
