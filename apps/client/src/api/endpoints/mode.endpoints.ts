import { transformFetchError } from '@workspace/core/api';

import { api } from 'api';

import type { ModeModel } from 'types/models/mode.model';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Input for updating a mode
 */
export interface UpdateModeInput {
  name?: string;
  sequence?: number;
  isActive?: boolean;
  isDefault?: boolean;
}

/**
 * Request to update which mode is default
 */
export interface UpdateDefaultModeRequest {
  modeId: string;
}

/**
 * Request to update active states of multiple modes
 */
export interface UpdateActiveStatesRequest {
  modes: Array<{
    id: string;
    isActive: boolean;
  }>;
}

// ============================================================================
// ENDPOINTS
// ============================================================================

/**
 * Modes API endpoints
 *
 * Manages dispensing modes and their configurations.
 */
export const EndpointsMode = {
  /**
   * Get all modes
   */
  getAll: async (): Promise<ModeModel[]> => {
    try {
      return await api.get<ModeModel[]>('/modes');
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Get the default mode
   */
  getDefault: async (): Promise<ModeModel | null> => {
    try {
      const modes = await api.get<ModeModel[]>('/modes');
      const defaultMode = modes.find((mode) => mode.isDefault);
      return defaultMode || null;
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Update an existing mode
   */
  update: async (id: string, updates: UpdateModeInput): Promise<ModeModel> => {
    try {
      return await api.patch<ModeModel>(`/modes/${id}`, updates);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Update which mode is the default
   */
  updateDefault: async (request: UpdateDefaultModeRequest): Promise<ModeModel[]> => {
    try {
      return await api.patch<ModeModel[]>('/modes/default-mode', request);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Update active states of multiple modes
   */
  updateActiveStates: async (request: UpdateActiveStatesRequest): Promise<ModeModel[]> => {
    try {
      return await api.patch<ModeModel[]>('/modes/active-states', request);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
