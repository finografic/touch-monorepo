import { transformFetchError } from '@workspace/core/api';
import type { DrinkType } from 'types/models/drink-type.model';
import { api } from 'api';

export type DrinkTypeUpdate = Partial<Omit<DrinkType, 'id'>>;

/**
 * Helper to transform server response to frontend format using JSON translations
 */
const transformDrinkType = (serverData: DrinkTypeEntity): DrinkType => ({
  id: serverData.id,
  name: serverData.name,
  translations: serverData.translations || {}, // Use JSON translations directly
  hasSubtypes: serverData.hasSubtypes ?? serverData.has_subtypes ?? false,
  isActive: serverData.isActive ?? serverData.is_active ?? true,
  defaultTempConsume: serverData.defaultTempConsume ?? serverData.default_temp_consume ?? 5,
  defaultTempFreeze: serverData.defaultTempFreeze ?? serverData.default_temp_freeze ?? -2,
});

/**
 * Drink Type API endpoints
 */
export const EndpointsDrinkType = {
  /**
   * Get all drink types with translations
   */
  getAll: async (): Promise<DrinkType[]> => {
    try {
      // Fetch client returns data directly
      const data = await api.get<DrinkType[]>('/drink-types');
      const drinkTypesArray = Array.isArray(data) ? data : [];
      return drinkTypesArray.map(transformDrinkType);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Get all drink types (alias for compatibility)
   */
  getDrinkTypes: async (): Promise<DrinkType[]> => {
    return EndpointsDrinkType.getAll();
  },

  /**
   * Get a single drink type by ID
   */
  getById: async (id: string): Promise<DrinkType> => {
    try {
      const data = await api.get<any>(`/drink-types/${id}`);
      return transformDrinkType(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Get a single drink type (alias for compatibility)
   */
  getDrinkType: async (id: string): Promise<DrinkType> => {
    return EndpointsDrinkType.getById(id);
  },

  /**
   * Update a drink type with new translations
   */
  updateDrinkType: async (id: string, updates: DrinkTypeUpdate): Promise<DrinkType> => {
    try {
      // Fetch client returns data directly
      const data = await api.patch<any>(`/drink-types/${id}`, updates);
      return transformDrinkType(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Create a new drink type
   * Uses POST to /drink-types
   */
  createDrinkType: async (updates: DrinkTypeUpdate): Promise<DrinkType> => {
    try {
      // Ensure required fields have defaults for new items
      const createData = {
        name: updates.name || '',
        translations: updates.translations || {},
        hasSubtypes: updates.hasSubtypes ?? false,
        defaultTempConsume: (updates as any).defaultTempConsume ?? 5,
        defaultTempFreeze: (updates as any).defaultTempFreeze ?? -2,
        ...updates, // Allow overriding defaults
      };

      // Fetch client returns data directly
      const data = await api.post<any>('/drink-types', createData);
      return transformDrinkType(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Delete a drink type
   * Uses DELETE to /drink-types/{id}
   */
  deleteDrinkType: async (id: string): Promise<void> => {
    try {
      await api.delete<void>(`/drink-types/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
