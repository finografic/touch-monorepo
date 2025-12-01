import { transformFetchError } from '@workspace/core/api';

import { api } from 'api';

// Types for drink type translations
export interface DrinkTypeTranslation {
  id: string;
  name: string;
  translations: Record<string, string>; // Dynamic translations from JSON
  hasSubtypes?: boolean;
  isActive?: boolean;
}

export type DrinkTypeUpdate = Partial<Omit<DrinkTypeTranslation, 'id'>>;

/**
 * Helper to transform server response to frontend format using JSON translations
 */
const transformDrinkType = (serverData: any): DrinkTypeTranslation => ({
  id: serverData.id,
  name: serverData.name,
  translations: serverData.translations || {}, // Use JSON translations directly
  hasSubtypes: serverData.hasSubtypes ?? serverData.has_subtypes ?? false,
  isActive: serverData.isActive ?? serverData.is_active ?? true,
});

/**
 * Drink Type API endpoints
 */
export const drinkTypeEndpoints = {
  /**
   * Get all drink types with translations
   */
  getDrinkTypes: async (): Promise<DrinkTypeTranslation[]> => {
    try {
      // Fetch client returns data directly
      const data = await api.get<any[]>('/drink-types');
      const drinkTypesArray = Array.isArray(data) ? data : [];
      return drinkTypesArray.map(transformDrinkType);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Update a drink type with new translations
   */
  updateDrinkType: async (id: string, updates: DrinkTypeUpdate): Promise<DrinkTypeTranslation> => {
    try {
      // Fetch client returns data directly
      const data = await api.patch<any>(`/drink-types/${id}`, updates);
      return transformDrinkType(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
