import { transformFetchError } from '@workspace/core/api';

import { api } from 'api';
import { slugify } from 'utils/string.utils';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Container type as returned from the server
 */
export interface ContainerTypeEntity {
  id: string;
  name: string;
  thermal_conductivity?: number;
  thermalConductivity?: number;
  is_active?: boolean;
  isActive?: boolean;
  created_at?: string | number;
  createdAt?: string | Date;
  updated_at?: string | number;
  updatedAt?: string | Date;
  translations?: Record<string, string>;
}

/**
 * Container type as used in the client
 */
export interface ContainerType {
  id: string;
  name: string;
  thermalConductivity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  translations: Record<string, string>;
}

/**
 * Input type for creating a container type
 */
export interface CreateContainerTypeInput {
  name: string;
  thermalConductivity: number;
  translations?: Record<string, string>;
}

/**
 * Input type for updating a container type
 */
export interface UpdateContainerTypeInput {
  name?: string;
  thermalConductivity?: number;
  translations?: Record<string, string>;
  isActive?: boolean;
}

// ============================================================================
// TRANSFORMERS
// ============================================================================

/**
 * Transform server response to client format
 * Handles: snake_case → camelCase, date parsing, nested data normalization
 */
const transformContainerType = (serverData: any): ContainerType => ({
  id: serverData.id,
  name: serverData.name,
  thermalConductivity: serverData.thermal_conductivity ?? serverData.thermalConductivity ?? 0,
  isActive: Boolean(serverData.is_active ?? serverData.isActive ?? true),
  createdAt: serverData.created_at
    ? new Date(
        typeof serverData.created_at === 'string' ? serverData.created_at : serverData.created_at * 1000,
      )
    : serverData.createdAt instanceof Date
      ? serverData.createdAt
      : new Date(),
  updatedAt: serverData.updated_at
    ? new Date(
        typeof serverData.updated_at === 'string' ? serverData.updated_at : serverData.updated_at * 1000,
      )
    : serverData.updatedAt instanceof Date
      ? serverData.updatedAt
      : new Date(),
  translations: serverData.translations || {},
});

// ============================================================================
// ENDPOINTS
// ============================================================================

/**
 * Container Type API endpoints
 *
 * All server communication for container types.
 * Used by query hooks and React Router loaders.
 *
 * @example
 * // In a query hook:
 * const { data } = useQuery({
 *   queryKey: ['container-types'],
 *   queryFn: EndpointsContainerType.getAll,
 * });
 *
 * @example
 * // In a React Router loader:
 * export const loader = EndpointsContainerType.getAll;
 */
export const EndpointsContainerType = {
  /**
   * Get all container types
   */
  getAll: async (): Promise<ContainerType[]> => {
    try {
      const data = await api.get<any[]>('/container-types');
      return Array.isArray(data) ? data.map(transformContainerType) : [];
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Get a single container type by ID
   */
  getById: async (id: string): Promise<ContainerType> => {
    try {
      const data = await api.get<any>(`/container-types/${id}`);
      return transformContainerType(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Create a new container type
   */
  create: async (input: CreateContainerTypeInput): Promise<ContainerType> => {
    try {
      // Convert display name to kebab-case for storage
      const kebabName = slugify(input.name);

      // Use provided translations directly (already contains correct display names)
      const translations = {
        'en-GB': '',
        'es-ES': '',
        'ca-ES': '',
        ...input.translations, // Merge with provided translations
      };

      const data = await api.post<any>('/container-types', {
        name: kebabName,
        thermalConductivity: input.thermalConductivity,
        translations,
      });

      return transformContainerType(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Update an existing container type
   */
  update: async (id: string, input: UpdateContainerTypeInput): Promise<ContainerType> => {
    try {
      const data = await api.patch<any>(`/container-types/${id}`, {
        name: input.name,
        thermalConductivity: input.thermalConductivity,
        translations: input.translations,
        isActive: input.isActive,
      });

      return transformContainerType(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Delete a container type
   */
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete<void>(`/container-types/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
