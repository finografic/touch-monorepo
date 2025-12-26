import { transformFetchError } from '@workspace/core/api';

import { api } from 'api';
import type { OrderReadableModel } from 'types/models/order-readable.model';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Input type for creating an order
 */
export interface CreateOrderInput {
  mode: number;
  drinkTypeId: string;
  drinkSubtypeId?: string;
  volumeId: string;
  containerTypeId: string;
  defaultTempConsume: number;
  defaultTempFreeze: number;
}

/**
 * Input type for updating an order
 */
export interface UpdateOrderInput {
  modeId?: string;
  drinkTypeId?: string;
  drinkSubtypeId?: string;
  volumeId?: string;
  containerTypeId?: string;
  defaultTempConsume?: number;
  defaultTempFreeze?: number;
}

/**
 * Temperature profile input for order creation
 */
export interface TemperatureProfileInput {
  temperature: number;
  timeA: number;
  timeB: number;
  timeC: number;
  modeId?: string;
}

/**
 * Complete order creation input with optional temperature profiles
 */
export interface CreateOrderWithProfilesInput {
  orderData: CreateOrderInput;
  temperatureProfiles?: TemperatureProfileInput[];
}

// ============================================================================
// ENDPOINTS
// ============================================================================

/**
 * Orders API endpoints
 *
 * Handles both regular orders and orders-readable view.
 * Note: orders-readable is a server-side join with human-readable names.
 */
export const EndpointsOrders = {
  /**
   * Get all orders with readable names (joined view)
   */
  getAllReadable: async (): Promise<OrderReadableModel[]> => {
    try {
      return await api.get<OrderReadableModel[]>('/orders-readable');
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Get a single order by ID with readable names (joined view)
   */
  getByIdReadable: async (id: string): Promise<OrderReadableModel> => {
    try {
      return await api.get<OrderReadableModel>(`/orders-readable/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Create a new order
   * Optionally creates associated temperature profiles in a single operation
   */
  create: async ({ orderData, temperatureProfiles = [] }: CreateOrderWithProfilesInput): Promise<any> => {
    try {
      // Step 1: Create the order
      const newOrder = await api.post('/orders', orderData);

      // Step 2: Create temperature profiles if provided
      if (temperatureProfiles.length > 0 && newOrder && typeof newOrder === 'object' && 'id' in newOrder) {
        const profilePromises = temperatureProfiles.map(async (profile) => {
          return await api.post('/temperature-profiles', {
            orderId: (newOrder as any).id,
            modeId: profile.modeId || 'default',
            temperature: profile.temperature,
            timeA: profile.timeA,
            timeB: profile.timeB,
            timeC: profile.timeC,
          });
        });

        await Promise.all(profilePromises);
      }

      return newOrder;
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Update an existing order
   */
  update: async (id: string, updates: UpdateOrderInput): Promise<any> => {
    try {
      return await api.patch(`/orders/${id}`, updates);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Delete an order
   */
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/orders/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Update temperature profiles for an order
   * Replaces all existing profiles with new ones
   */
  updateTemperatureProfiles: async (orderId: string, profiles: TemperatureProfileInput[]): Promise<void> => {
    try {
      // Delete existing profiles
      await api.delete(`/orders/${orderId}/temperature-profiles`);

      // Create new profiles
      if (profiles.length > 0) {
        const profilePromises = profiles.map(async (profile) => {
          return await api.post('/temperature-profiles', {
            orderId,
            modeId: profile.modeId || 'default',
            temperature: profile.temperature,
            timeA: profile.timeA,
            timeB: profile.timeB,
            timeC: profile.timeC,
          });
        });

        await Promise.all(profilePromises);
      }
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
