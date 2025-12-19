/**
 * Modern Fetch-based Endpoint Helper [Claude v3.5]
 *
 * Replaces Axios-based endpoints with native fetch for better performance.
 * Provides consistent error handling and response transformation.
 */

import type {
  ContainerTypeEntity,
  DrinkSubtypeEntity,
  DrinkTypeEntity,
  DrinkVolumeEntity,
} from '@workspace/server/types/entities';

import type {
  SupportedLanguageInput,
  SupportedLanguageUpdate,
} from 'queries/supported-languages/supported-languages.types';

import type { AnalyticsData } from 'types/analytics.types';
import type { ContainerType, DrinkSubtype, DrinkType, DrinkVolume } from 'types/models/container-type.model';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { SupportedLanguage } from 'types/models/supported-language.model';
import type { TemperatureProfileEntity } from 'types/models/temperature.model';
import type { FilterKey } from 'types/slots.types';
import { fetchClient } from './fetch-client';

/**
 * Modern fetch-based endpoint helper with consistent error handling
 */
export const FetchEndpointHelper = {
  // Drink Types
  getDrinkTypes: async (): Promise<DrinkType[]> => {
    return fetchClient.get<DrinkType[]>('/drink-types');
  },

  getDrinkType: async (id: string): Promise<DrinkTypeEntity> => {
    return fetchClient.get<DrinkTypeEntity>(`/drink-types/${id}`);
  },

  // Drink Subtypes
  getDrinkSubtypes: async ({ drinkTypeId }: { drinkTypeId: string }): Promise<DrinkSubtypeEntity> => {
    return fetchClient.get<DrinkSubtypeEntity>(`/drink-types/${drinkTypeId}/subtypes`);
  },

  // Drink Volumes
  getDrinkVolumes: async (): Promise<DrinkVolume[]> => {
    return fetchClient.get<DrinkVolume[]>('/drink-volumes');
  },

  getDrinkVolume: async (id: string): Promise<DrinkVolumeEntity> => {
    return fetchClient.get<DrinkVolumeEntity>(`/drink-volumes/${id}`);
  },

  // Container Types
  getContainerTypes: async (): Promise<ContainerType[]> => {
    return fetchClient.get<ContainerType[]>('/container-types');
  },

  getContainerType: async (id: string): Promise<ContainerTypeEntity> => {
    return fetchClient.get<ContainerTypeEntity>(`/container-types/${id}`);
  },

  // Temperature Profiles
  getTemperatureProfile: async (id: string): Promise<TemperatureProfileEntity> => {
    return fetchClient.get<TemperatureProfileEntity>(`/temperature-profiles/${id}`);
  },

  // Orders
  getOrdersReadable: async (): Promise<OrderReadableModel[]> => {
    return fetchClient.get<OrderReadableModel[]>('/orders-readable');
  },

  // Analytics
  getAnalytics: async (params: { from: Date; to: Date }): Promise<AnalyticsData> => {
    return fetchClient.get<AnalyticsData>('/analytics', {
      // Custom timeout for analytics (longer processing time)
      timeout: 30000,
      // Add query parameters
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  },

  // Supported Languages
  getSupportedLanguages: async (): Promise<SupportedLanguage[]> => {
    return fetchClient.get<SupportedLanguage[]>('/supported-languages');
  },

  getSupportedLanguage: async (id: string): Promise<SupportedLanguage> => {
    return fetchClient.get<SupportedLanguage>(`/supported-languages/${id}`);
  },

  createSupportedLanguage: async (data: SupportedLanguageInput): Promise<SupportedLanguage> => {
    return fetchClient.post<SupportedLanguage>('/supported-languages', data);
  },

  updateSupportedLanguage: async (id: string, data: SupportedLanguageUpdate): Promise<SupportedLanguage> => {
    return fetchClient.patch<SupportedLanguage>(`/supported-languages/${id}`, data);
  },

  deleteSupportedLanguage: async (id: string): Promise<void> => {
    return fetchClient.delete<void>(`/supported-languages/${id}`);
  },
} as const;

/**
 * React Query hook for fetch-based endpoints
 */
export const useFetchEndpointQuery = <TData>(
  key: string[],
  endpointFn: () => Promise<TData>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
  } = {},
) => {
  // Note: You'll need to import useQuery from @tanstack/react-query
  // This is just the hook structure - implement with your React Query setup
  return {
    queryKey: key,
    queryFn: endpointFn,
    retry: options.maxRetries ?? 3,
    retryDelay: options.retryDelay ?? 1000,
    enabled: options.enabled,
    staleTime: options.staleTime,
    cacheTime: options.cacheTime,
  };
};

/**
 * Example usage hooks
 */
export const useGetDrinkType = (id: string) => {
  return useFetchEndpointQuery(['drinkType', id], () => FetchEndpointHelper.getDrinkType(id), {
    maxRetries: 2,
    enabled: !!id,
  });
};

export const useGetAnalytics = (params: { from: Date; to: Date }) => {
  return useFetchEndpointQuery(
    ['analytics', params.from.toISOString(), params.to.toISOString()],
    () => FetchEndpointHelper.getAnalytics(params),
    {
      maxRetries: 5,
      retryDelay: 60000, // 1 minute for rate-limited endpoint
      enabled: !!params.from && !!params.to,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );
};
