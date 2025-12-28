import { transformFetchError } from '@workspace/core/api';

import { api } from 'api';

import type {
  BulkUpdateSlotConfigRequest,
  CreateSlotConfigRequest,
  SlotConfiguration,
  UpdateSlotConfigRequest,
} from 'types/slot-config.types';

// ============================================================================
// ENDPOINTS
// ============================================================================

/**
 * Slot Configurations API endpoints
 *
 * Manages slot configurations for the dispensing system.
 * Includes standard CRUD plus bulk operations and reset functionality.
 */
export const slotConfigurationsEndpoints = {
  /**
   * Get all slot configurations
   */
  getAll: async (): Promise<SlotConfiguration[]> => {
    try {
      return await api.get<SlotConfiguration[]>('/slot-configurations');
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Get a single slot configuration by slot number
   */
  getBySlotNumber: async (slotNumber: number): Promise<SlotConfiguration> => {
    try {
      return await api.get<SlotConfiguration>(`/slot-configurations/${slotNumber}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Create a new slot configuration
   */
  create: async (data: CreateSlotConfigRequest): Promise<SlotConfiguration> => {
    try {
      return await api.post<SlotConfiguration>('/slot-configurations', data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Update an existing slot configuration
   */
  update: async (slotNumber: number, data: UpdateSlotConfigRequest): Promise<SlotConfiguration> => {
    try {
      return await api.patch<SlotConfiguration>(`/slot-configurations/${slotNumber}`, data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Delete a slot configuration
   */
  delete: async (slotNumber: number): Promise<void> => {
    try {
      await api.delete<void>(`/slot-configurations/${slotNumber}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Bulk update multiple slot configurations
   */
  bulkUpdate: async (data: BulkUpdateSlotConfigRequest): Promise<SlotConfiguration[]> => {
    try {
      return await api.post<SlotConfiguration[]>('/slot-configurations/bulk-update', data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Reset all slot configurations to default
   */
  reset: async (): Promise<{ success: boolean; message: string }> => {
    try {
      return await api.post<{ success: boolean; message: string }>('/slot-configurations/reset');
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
