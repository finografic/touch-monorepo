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
   * Requires drinkTypeId to use the nested endpoint: /drink-types/{drinkTypeId}/subtypes/{id}
   */
  updateDrinkSubtype: async (
    id: string,
    updates: DrinkSubtypeUpdate,
    drinkTypeId: string,
  ): Promise<DrinkSubtypeTranslation> => {
    try {
      if (!drinkTypeId) {
        throw new Error('drinkTypeId is required to update drink subtypes');
      }

      const response = await api.patch(`/drink-types/${drinkTypeId}/subtypes/${id}`, updates);
      const data = response.data?.data || response.data;
      return transformDrinkSubtype(data);
    } catch (error) {
      throw transformAxiosError(error);
    }
  },
} as const;
