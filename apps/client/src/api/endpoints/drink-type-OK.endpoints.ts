import { transformFetchError } from '@workspace/core/api';
import type { DrinkType } from 'types/models/drink-type.model';
import { api } from 'api';

export type DrinkTypeUpdate = Partial<Omit<DrinkType, 'id'>>;

/**
 * Drink Type API endpoints
 */
export const EndpointsDrinkType = {
  getAll: async (): Promise<DrinkType[]> => {
    try {
      const data = await api.get<DrinkType[]>('/drink-types');
      return Array.isArray(data) ? data : []; // TODO: necessary ??
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  getById: async (id: string): Promise<DrinkType> => {
    try {
      return await api.get<DrinkType>(`/drink-types/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  update: async (id: string, updates: DrinkTypeUpdate): Promise<DrinkType> => {
    try {
      return await api.patch<DrinkType>(`/drink-types/${id}`, updates);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  create: async (updates: DrinkTypeUpdate): Promise<DrinkType> => {
    try {
      // Ensure required fields have defaults for new items
      const createData = {
        name: updates.name || '',
        translations: updates.translations || {},
        hasSubtypes: updates.hasSubtypes ?? false,
        defaultTempConsume: updates.defaultTempConsume ?? 5,
        defaultTempFreeze: updates.defaultTempFreeze ?? -2,
        ...updates, // Allow overriding defaults
      };

      // Fetch client returns data directly
      return await api.post<DrinkType>('/drink-types', createData);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete<void>(`/drink-types/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
