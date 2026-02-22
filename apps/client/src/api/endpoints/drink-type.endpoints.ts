import { transformFetchError } from '@workspace/core/api';
import { TEMP_CONSUME_DEFAULT, TEMP_FREEZE_DEFAULT } from '@workspace/shared/constants';

import { api } from 'api';

import type { DrinkType } from 'types/models/drink-type.model';

export type DrinkTypeUpdate = Partial<Omit<DrinkType, 'id'>>;

export const EndpointsDrinkType = {
  getAll: async (): Promise<DrinkType[]> => {
    try {
      const data = await api.get<DrinkType[]>('/drink-types');
      return Array.isArray(data) ? data : [];
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
      const createData = {
        name: updates.name || '',
        translations: updates.translations || {},
        hasSubtypes: updates.hasSubtypes ?? false,
        defaultTempConsume: updates.defaultTempConsume ?? TEMP_CONSUME_DEFAULT,
        defaultTempFreeze: updates.defaultTempFreeze ?? TEMP_FREEZE_DEFAULT,
        ...updates,
      };

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
