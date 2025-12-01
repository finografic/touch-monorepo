import { transformFetchError } from '@workspace/core/api';

import { api } from 'api';

// Types for container type translations
export interface ContainerTypeTranslation {
  id: string;
  name: string;
  translations: Record<string, string>; // Dynamic translations from JSON
  thermalConductivity?: number;
  isActive?: boolean;
}

export type ContainerTypeUpdate = Partial<Omit<ContainerTypeTranslation, 'id'>>;

/**
 * Helper to transform server response to frontend format using JSON translations
 */
const transformContainerType = (serverData: any): ContainerTypeTranslation => ({
  id: serverData.id,
  name: serverData.name,
  translations: serverData.translations || {}, // Use JSON translations directly
  thermalConductivity: serverData.thermalConductivity || serverData.thermal_conductivity,
  isActive: serverData.isActive ?? serverData.is_active ?? true,
});

/**
 * Container Type API endpoints
 */
export const containerTypeEndpoints = {
  /**
   * Get all container types with translations
   */
  getContainerTypes: async (): Promise<ContainerTypeTranslation[]> => {
    try {
      // Fetch client returns data directly
      const data = await api.get<any[]>('/container-types');
      const containerTypesArray = Array.isArray(data) ? data : [];
      return containerTypesArray.map(transformContainerType);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Update a container type with new translations
   */
  updateContainerType: async (
    id: string,
    updates: ContainerTypeUpdate,
  ): Promise<ContainerTypeTranslation> => {
    try {
      // Fetch client returns data directly
      const data = await api.patch<any>(`/container-types/${id}`, updates);
      return transformContainerType(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
