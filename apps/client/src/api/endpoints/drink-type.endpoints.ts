import { transformAxiosError } from '@workspace/core/api';
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
      const response = await api.get('/drink-types');
      const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
      return data.map(transformDrinkType);
    } catch (error) {
      throw transformAxiosError(error);
    }
  },

  /**
   * Update a drink type with new translations
   */
  updateDrinkType: async (id: string, updates: DrinkTypeUpdate): Promise<DrinkTypeTranslation> => {
    try {
      const response = await api.patch(`/drink-types/${id}`, updates);
      const data = response.data?.data || response.data;
      return transformDrinkType(data);
    } catch (error) {
      throw transformAxiosError(error);
    }
  },
} as const;
