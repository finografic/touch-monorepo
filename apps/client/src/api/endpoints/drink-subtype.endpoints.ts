import { transformFetchError } from '@workspace/core/api';

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
      // Fetch client returns data directly (unwraps ApiResponse)
      const drinkTypesData = await api.get<any[]>('/drink-types');
      const drinkTypesArray = Array.isArray(drinkTypesData) ? drinkTypesData : [];

      const drinkTypes = drinkTypesArray.map((dt: any) => ({
        id: dt.id,
        hasSubtypes: dt.hasSubtypes ?? dt.has_subtypes ?? false,
      }));

      const subtypesPromises = drinkTypes
        .filter((dt) => dt.hasSubtypes)
        .map(async (dt) => {
          try {
            // Fetch client returns data directly
            const data = await api.get<any[]>(`/drink-types/${dt.id}/subtypes`);
            const subtypesArray = Array.isArray(data) ? data : [];
            return subtypesArray.map(transformDrinkSubtype);
          } catch (error) {
            console.warn(`Failed to fetch subtypes for drink type ${dt.id}:`, error);
            return [];
          }
        });

      const subtypesResponses = await Promise.all(subtypesPromises);
      return subtypesResponses.flat();
    } catch (error) {
      throw transformFetchError(error);
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

      // Fetch client returns data directly
      const data = await api.patch<any>(`/drink-types/${drinkTypeId}/subtypes/${id}`, updates);
      return transformDrinkSubtype(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
