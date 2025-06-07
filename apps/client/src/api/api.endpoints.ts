// @ts-nocheck
import axios, { HttpStatusCode } from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import type { ApiResponse, ErrorResponse } from '@workspace/common/api';
import { AXIOS_ERROR_CODE_MAP } from '@workspace/common/api';
import cloneDeep from 'lodash/cloneDeep';
import type { OrderFieldKey } from 'types/orders.types';
import type { ContainerType, DrinkSubtype, DrinkType, DrinkVolume } from 'types/models/container-type.model';
import type {
  ContainerTypeEntity,
  DrinkSubtypeEntity,
  DrinkTypeEntity,
  DrinkVolumeEntity,
} from '@workspace/server/types/entities';
import { api } from 'api';
import { isRetryableError, transformAxiosError__V2 } from './api.utils';
import type { TemperatureProfileEntity } from 'types/models/temperature.model';
import { useQuery } from '@tanstack/react-query';
import type { AnalyticsData } from 'types/analytics.types';

// Utility type for endpoint functions
type EndpointFunction = (...args: any[]) => Promise<any>;

/**
 * Creates a wrapper around API endpoints with consistent error handling
 * and response transformation
 */
const createEndpoints = <T extends Record<string, EndpointFunction>>(endpoints: T) => {
  return Object.entries(endpoints).reduce(
    (acc, [key, fn]) => ({
      ...acc,
      [key]: async (...args: Parameters<typeof fn>) => {
        try {
          const response = await fn(...args);

          // Handle non-200 responses that might not throw
          if (response.status >= 400) {
            throw new Error(response?.data?.message || 'Request failed', {
              cause: {
                status: response.status,
                data: response.data,
              },
            });
          }

          return response.data;
        } catch (error) {
          const transformedError = transformAxiosError__V2(error);

          // Add endpoint-specific context to the error
          transformedError.endpoint = key;
          transformedError.params = args;

          throw transformedError;
        }
      },
    }),
    {} as {
      [K in keyof T]: (...args: Parameters<T[K]>) => Promise<Awaited<ReturnType<T[K]>>['data']>;
    },
  );
};

// Example of how to use with React Query in a hook
export const useEndpointQuery = <TData>(
  key: string[],
  endpointFn: () => Promise<TData>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    enabled?: boolean;
  } = {},
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      try {
        return await endpointFn();
      } catch (error) {
        const transformedError = transformAxiosError__V2(error);
        throw transformedError;
      }
    },
    retry: (failureCount, error: ErrorResponse) => {
      if (!error.isRetryable) return false;
      return failureCount < (options.maxRetries ?? 3);
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff with base delay
      return Math.min(1000 * 2 ** attemptIndex, options.retryDelay ?? 30000);
    },
    enabled: options.enabled,
  });
};

// Example endpoints with type safety
export const EndpointHelper = createEndpoints({
  getDrinkTypes: async () => await api.get<ApiResponse<DrinkType[]>>('/drink-types'),
  getDrinkType: async (id: string) => await api.get<ApiResponse<DrinkTypeEntity>>(`/drink-types/${id}`),

  getDrinkSubtypes: async ({ drinkTypeId }: { drinkTypeId: string }) =>
    await api.get<ApiResponse<DrinkSubtypeEntity>>(`/drink-types/${drinkTypeId}/subtypes`),

  getDrinkVolumes: async () => await api.get<ApiResponse<DrinkVolume[]>>('/drink-volumes'),
  getDrinkVolume: async (id: string) => await api.get<ApiResponse<DrinkVolumeEntity>>(`/drink-volumes/${id}`),

  getContainerTypes: async () => await api.get<ApiResponse<ContainerType[]>>('/container-types'),
  getContainerType: async (id: string) =>
    await api.get<ApiResponse<ContainerTypeEntity>>(`/container-types/${id}`),

  getTemperatureProfile: async (id: string) =>
    await api.get<ApiResponse<TemperatureProfileEntity>>(`/temperature-profiles/${id}`),
  getAnalytics: async (params: { from: Date; to: Date }) =>
    await api.get<ApiResponse<AnalyticsData>>('/analytics', {
      params,
      // Example of endpoint-specific configuration
      timeout: 30000,
      headers: {
        'Cache-Control': 'no-cache',
      },
    }),
}) as const;

// Example usage in a hook with the new utility
export const useGetDrinkType = (id: string) => {
  return useEndpointQuery(['drinkType', id], () => EndpointHelper.getDrinkType(id), {
    maxRetries: 2,
    enabled: !!id,
  });
};

// Example of a rate-limited endpoint with custom retry logic
export const useGetAnalytics = (params: { from: Date; to: Date }) => {
  return useEndpointQuery(
    ['analytics', params.from.toISOString(), params.to.toISOString()],
    () => EndpointHelper.getAnalytics(params),
    {
      maxRetries: 5,
      retryDelay: 60000, // 1 minute between retries for rate-limited endpoint
      enabled: !!params.from && !!params.to,
    },
  );
};
