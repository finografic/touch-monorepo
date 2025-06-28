import { api } from 'api';
import type { ApiResponse } from '@workspace/core/api';
import { transformAxiosError__V2 } from '../api.utils';

// Types for translation entities - now using dynamic Record for translations
export interface DrinkTypeTranslation {
  id: string;
  name: string;
  translations: Record<string, string>; // Dynamic translations from JSON
  hasSubtypes?: boolean;
  isActive?: boolean;
}

export interface DrinkSubtypeTranslation {
  id: string;
  name: string;
  translations: Record<string, string>; // Dynamic translations from JSON
  drinkTypeId: string;
  isActive?: boolean;
}

export interface VolumeTranslation {
  id: string;
  name: string;
  translations: Record<string, string>; // Dynamic translations from JSON
  isActive?: boolean;
}

export interface ContainerTypeTranslation {
  id: string;
  name: string;
  translations: Record<string, string>; // Dynamic translations from JSON
  thermalConductivity?: number;
  isActive?: boolean;
}

// Update types - now work with translations object
export type DrinkTypeUpdate = Partial<Omit<DrinkTypeTranslation, 'id'>>;
export type DrinkSubtypeUpdate = Partial<Omit<DrinkSubtypeTranslation, 'id'>>;
export type VolumeUpdate = Partial<Omit<VolumeTranslation, 'id'>>;
export type ContainerTypeUpdate = Partial<Omit<ContainerTypeTranslation, 'id'>>;

// Cache for supported languages to avoid repeated API calls
let supportedLanguagesCache: Array<{ isoCode: string; sortOrder: number }> | null = null;
let cacheExpiry = 0;

// Helper function to get supported languages with caching
const getSupportedLanguages = async (): Promise<Array<{ isoCode: string; sortOrder: number }>> => {
  const now = Date.now();

  // Return cached data if still valid (5 minutes cache)
  if (supportedLanguagesCache && now < cacheExpiry) {
    return supportedLanguagesCache;
  }

  try {
    const response = await api.get('/supported-languages');
    const data = Array.isArray(response.data) ? response.data : response.data?.data || [];

    // Sort by sort_order to ensure proper ordering
    const languageData = data
      .filter((lang: any) => lang.isActive)
      .map((lang: any) => ({
        isoCode: lang.isoCode,
        sortOrder: lang.sortOrder || 0,
      }))
      .sort((a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder);

    supportedLanguagesCache = languageData;

    cacheExpiry = now + 5 * 60 * 1000; // 5 minutes
    return languageData;
  } catch (error) {
    console.warn('Failed to fetch supported languages, using fallback:', error);
    // Fallback to original languages if API fails
    return [
      { isoCode: 'es-ES', sortOrder: 1 },
      { isoCode: 'en-GB', sortOrder: 2 },
      { isoCode: 'ca-ES', sortOrder: 3 },
    ];
  }
};

/**
 * Helper function to handle API responses with error transformation
 */
const handleApiCall = async <T>(apiCall: () => Promise<any>): Promise<T> => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    throw transformAxiosError__V2(error);
  }
};

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

const transformDrinkSubtype = (serverData: any): DrinkSubtypeTranslation => ({
  id: serverData.id,
  name: serverData.name,
  translations: serverData.translations || {}, // Use JSON translations directly
  drinkTypeId: serverData.drinkTypeId || serverData.drink_type_id,
  isActive: serverData.isActive ?? serverData.is_active ?? true,
});

const transformVolume = (serverData: any): VolumeTranslation => ({
  id: serverData.id,
  name: serverData.name,
  translations: serverData.translations || {}, // Use JSON translations directly
  isActive: serverData.isActive ?? serverData.is_active ?? true,
});

const transformContainerType = (serverData: any): ContainerTypeTranslation => ({
  id: serverData.id,
  name: serverData.name,
  translations: serverData.translations || {}, // Use JSON translations directly
  thermalConductivity: serverData.thermalConductivity || serverData.thermal_conductivity,
  isActive: serverData.isActive ?? serverData.is_active ?? true,
});

/**
 * Translation API endpoints that connect to existing server CRUD operations
 */
export const translationEndpoints = {
  // Drink Types
  getDrinkTypes: async (): Promise<DrinkTypeTranslation[]> => {
    try {
      const response = await api.get('/drink-types');
      const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
      return data.map(transformDrinkType);
    } catch (error) {
      throw transformAxiosError__V2(error);
    }
  },

  updateDrinkType: async (id: string, updates: DrinkTypeUpdate): Promise<DrinkTypeTranslation> => {
    try {
      const response = await api.patch(`/drink-types/${id}`, updates);
      const data = response.data?.data || response.data;
      return transformDrinkType(data);
    } catch (error) {
      throw transformAxiosError__V2(error);
    }
  },

  // Drink Subtypes (via drink-types endpoint)
  getDrinkSubtypes: async (): Promise<DrinkSubtypeTranslation[]> => {
    try {
      // Get all drink types first, then fetch their subtypes
      const drinkTypes = await translationEndpoints.getDrinkTypes();
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
      throw transformAxiosError__V2(error);
    }
  },

  updateDrinkSubtype: async (id: string, updates: DrinkSubtypeUpdate): Promise<DrinkSubtypeTranslation> => {
    // Note: There's no direct drink-subtype endpoint, so we'll need to handle this differently
    // For now, we'll throw an error to indicate this needs to be implemented
    throw new Error('Direct drink subtype updates not supported. Use drink type management instead.');
  },

  // Volumes (using drink-volumes endpoint)
  getVolumes: async (): Promise<VolumeTranslation[]> => {
    try {
      const response = await api.get('/drink-volumes');
      const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
      return data.map(transformVolume);
    } catch (error) {
      throw transformAxiosError__V2(error);
    }
  },

  updateVolume: async (id: string, updates: VolumeUpdate): Promise<VolumeTranslation> => {
    try {
      const response = await api.patch(`/drink-volumes/${id}`, updates);
      const data = response.data?.data || response.data;
      return transformVolume(data);
    } catch (error) {
      throw transformAxiosError__V2(error);
    }
  },

  // Container Types
  getContainerTypes: async (): Promise<ContainerTypeTranslation[]> => {
    try {
      const response = await api.get('/container-types');
      const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
      return data.map(transformContainerType);
    } catch (error) {
      throw transformAxiosError__V2(error);
    }
  },

  updateContainerType: async (
    id: string,
    updates: ContainerTypeUpdate,
  ): Promise<ContainerTypeTranslation> => {
    try {
      const response = await api.patch(`/container-types/${id}`, updates);
      const data = response.data?.data || response.data;
      return transformContainerType(data);
    } catch (error) {
      throw transformAxiosError__V2(error);
    }
  },

  // Batch update operations for form submission
  batchUpdateTranslations: async (data: {
    drinkTypes?: Array<{ id: string; updates: DrinkTypeUpdate }>;
    drinkSubtypes?: Array<{ id: string; updates: DrinkSubtypeUpdate }>;
    volumes?: Array<{ id: string; updates: VolumeUpdate }>;
    containerTypes?: Array<{ id: string; updates: ContainerTypeUpdate }>;
  }) => {
    const promises: Promise<any>[] = [];

    // Update drink types
    if (data.drinkTypes) {
      promises.push(
        ...data.drinkTypes.map(({ id, updates }) => translationEndpoints.updateDrinkType(id, updates)),
      );
    }

    // Update drink subtypes - Skip for now as there's no direct endpoint
    // TODO: Implement drink subtype updates via a different mechanism
    if (data.drinkSubtypes && data.drinkSubtypes.length > 0) {
      console.warn('Drink subtype updates are not currently supported via direct API calls');
    }

    // Update volumes
    if (data.volumes) {
      promises.push(...data.volumes.map(({ id, updates }) => translationEndpoints.updateVolume(id, updates)));
    }

    // Update container types
    if (data.containerTypes) {
      promises.push(
        ...data.containerTypes.map(({ id, updates }) =>
          translationEndpoints.updateContainerType(id, updates),
        ),
      );
    }

    // Execute all updates in parallel
    const results = await Promise.allSettled(promises);

    // Check for any failures
    const failures = results.filter((result) => result.status === 'rejected');
    if (failures.length > 0) {
      console.error('Some translation updates failed:', failures);
      throw new Error(`${failures.length} translation updates failed`);
    }

    return results.filter((result) => result.status === 'fulfilled').map((result) => result.value);
  },
} as const;
