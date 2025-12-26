import { transformFetchError } from '@workspace/core/api';

import { api } from 'api';
import type { ContainerType } from 'types/models/container.model';
import { slugify } from 'utils/string.utils';

export type ContainerTypeUpdate = Partial<Omit<ContainerType, 'id'>>;

export const EndpointsContainerType = {
  getAll: async (): Promise<ContainerType[]> => {
    try {
      const data = await api.get<ContainerType[]>('/container-types');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  getById: async (id: string): Promise<ContainerType> => {
    try {
      return await api.get<ContainerType>(`/container-types/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  create: async (
    input: ContainerTypeUpdate & { name: string; thermalConductivity: number },
  ): Promise<ContainerType> => {
    try {
      const kebabName = slugify(input.name);

      const translations = {
        'en-GB': '',
        'es-ES': '',
        'ca-ES': '',
        ...input.translations,
      };

      return await api.post<ContainerType>('/container-types', {
        name: kebabName,
        thermalConductivity: input.thermalConductivity,
        translations,
      });
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  update: async (id: string, input: ContainerTypeUpdate): Promise<ContainerType> => {
    try {
      return await api.patch<ContainerType>(`/container-types/${id}`, input);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete<void>(`/container-types/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
