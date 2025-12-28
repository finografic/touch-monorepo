import { transformFetchError } from '@workspace/core/api';

import { api } from 'api';

import type { DrinkSubtype } from 'types/models/drink-type.model';

export type DrinkSubtypeUpdate = Partial<Omit<DrinkSubtype, 'id'>>;

export const EndpointsDrinkSubtype = {
  getAll: async (): Promise<DrinkSubtype[]> => {
    try {
      const drinkTypesData = await api.get<Array<{ id: string; hasSubtypes: boolean }>>('/drink-types');
      const drinkTypes = Array.isArray(drinkTypesData) ? drinkTypesData : [];

      const subtypesPromises = drinkTypes
        .filter((dt) => dt.hasSubtypes)
        .map(async (dt) => {
          try {
            const data = await api.get<DrinkSubtype[]>(`/drink-types/${dt.id}/subtypes`);
            return Array.isArray(data) ? data : [];
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

  getByDrinkTypeId: async (drinkTypeId: string): Promise<DrinkSubtype[]> => {
    try {
      const data = await api.get<DrinkSubtype[]>(`/drink-types/${drinkTypeId}/subtypes`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  getById: async (id: string, drinkTypeId: string): Promise<DrinkSubtype> => {
    try {
      return await api.get<DrinkSubtype>(`/drink-types/${drinkTypeId}/subtypes/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  create: async (updates: DrinkSubtypeUpdate & { drinkTypeId: string }): Promise<DrinkSubtype> => {
    try {
      const { drinkTypeId, ...subtypeData } = updates;
      if (!drinkTypeId) {
        throw new Error('drinkTypeId is required to create drink subtypes');
      }

      const createData = {
        name: subtypeData.name || '',
        translations: subtypeData.translations || {},
        ...subtypeData,
      };

      return await api.post<DrinkSubtype>(`/drink-types/${drinkTypeId}/subtypes`, createData);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  update: async (id: string, updates: DrinkSubtypeUpdate, drinkTypeId: string): Promise<DrinkSubtype> => {
    try {
      if (!drinkTypeId) {
        throw new Error('drinkTypeId is required to update drink subtypes');
      }

      return await api.patch<DrinkSubtype>(`/drink-types/${drinkTypeId}/subtypes/${id}`, updates);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  delete: async (id: string, drinkTypeId: string): Promise<void> => {
    try {
      if (!drinkTypeId) {
        throw new Error('drinkTypeId is required to delete drink subtypes');
      }
      await api.delete<void>(`/drink-types/${drinkTypeId}/subtypes/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
