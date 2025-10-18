import { transformAxiosError } from '@workspace/core/api';

import { api } from 'api';

// Types for drink subtype translations
export interface DrinkSubtypeTranslation {
  id: string;
  name: string;
  translations: Record<string, string>; // Dynamic translations from JSON
  drinkTypeId: string;
  isActive?: boolean;
}

export type DrinkSubtypeUpdate = Partial<Omit<DrinkSubtypeTranslation, 'id'>>;

/**
 * Helper to transform server response to frontend format using JSON translations
 */
const transformDrinkSubtype = (serverData: any): DrinkSubtypeTranslation => ({
  id: serverData.id,
  name: serverData.name,
  translations: serverData.translations || {}, // Use JSON translations directly
  drinkTypeId: serverData.drinkTypeId || serverData.drink_type_id,
  isActive: serverData.isActive ?? serverData.is_active ?? true,
});

/**
 * Drink Subtype API endpoints
 */
export const drinkSubtypeEndpoints = {
  /**
   * Get all drink subtypes with translations
   * Fetches subtypes for all drink types that have subtypes
   */
  getDrinkSubtypes: async (): Promise<DrinkSubtypeTranslation[]> => {
    try {
      // Get all drink types first, then fetch their subtypes
      const drinkTypesResponse = await api.get('/drink-types');
      const drinkTypesData = Array.isArray(drinkTypesResponse.data)
        ? drinkTypesResponse.data
        : drinkTypesResponse.data?.data || [];

      const drinkTypes = drinkTypesData.map((dt: any) => ({
        id: dt.id,
        hasSubtypes: dt.hasSubtypes ?? dt.has_subtypes ?? false,
      }));

      const subtypesPromises = drinkTypes
        .filter((dt) => dt.hasSubtypes)
        .map(async (dt) => {
          try {
            const response = await api.get(`/drink-types/${dt.id}/subtypes`);
            const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
            return data.map(transformDrinkSubtype);
          } catch (error) {
            console.warn(`Failed to fetch subtypes for drink type ${dt.id}:`, error);
            return [];
          }
        });

      const subtypesResponses = await Promise.all(subtypesPromises);
      return subtypesResponses.flat();
    } catch (error) {
      throw transformAxiosError(error);
    }
  },

  /**
   * Update a drink subtype with new translations
   * Note: There's no direct drink-subtype endpoint, so this needs to be implemented
   */
  updateDrinkSubtype: async (id: string, updates: DrinkSubtypeUpdate): Promise<DrinkSubtypeTranslation> => {
    // Note: There's no direct drink-subtype endpoint, so we'll need to handle this differently
    // For now, we'll throw an error to indicate this needs to be implemented
    throw new Error('Direct drink subtype updates not supported. Use drink type management instead.');
  },
} as const;
