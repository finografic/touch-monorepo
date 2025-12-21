import type { ErrorResponse } from '@workspace/core/api';
import { isRetryableError, transformFetchError } from '@workspace/core/api';
import type { DrinkSubtypeEntity, DrinkTypeEntity } from '@workspace/server/types/entities';

import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

import type {
  SupportedLanguageInput,
  SupportedLanguageUpdate,
} from 'queries/supported-languages/supported-languages.types';

import type { AnalyticsData } from 'types/analytics.types';
import type { ContainerType, DrinkType, DrinkVolume } from 'types/models';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { SupportedLanguage } from 'types/models/supported-language.model';
import type { TemperatureProfileEntity } from 'types/models/temperature.model';

// Utility type for endpoint functions
type EndpointFunction = (...args: any[]) => Promise<any>;

/**
 * Creates a wrapper around API endpoints with consistent error handling
 *
 * Note: The fetch client already returns data directly (not wrapped in response.data),
 * so this wrapper mainly adds error transformation and endpoint context.
 */
const createEndpoints = <T extends Record<string, EndpointFunction>>(endpoints: T) => {
  return Object.entries(endpoints).reduce(
    (acc, [key, fn]) => ({
      ...acc,
      [key]: async (...args: Parameters<typeof fn>) => {
        try {
          // Fetch client already returns data directly (normalized)
          return await fn(...args);
        } catch (error) {
          const transformedError = transformFetchError(error);

          // Add endpoint-specific context to the error
          (transformedError as any).endpoint = key;
          (transformedError as any).params = args;

          throw transformedError;
        }
      },
    }),
    {} as {
      [K in keyof T]: (...args: Parameters<T[K]>) => Promise<Awaited<ReturnType<T[K]>>>;
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
        const transformedError = transformFetchError(error);
        throw transformedError;
      }
    },
    retry: (failureCount, error: ErrorResponse) => {
      if (!isRetryableError) return false;
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
// Note: The fetch client automatically unwraps ApiResponse<T> to return T directly
export const EndpointHelper = createEndpoints({
  getDrinkTypes: async () => await api.get<DrinkType[]>('/drink-types'),
  getDrinkType: async (id: string) => await api.get<DrinkTypeEntity>(`/drink-types/${id}`),

  getDrinkSubtypes: async ({ drinkTypeId }: { drinkTypeId: string }) =>
    await api.get<DrinkSubtypeEntity>(`/drink-types/${drinkTypeId}/subtypes`),

  getDrinkVolumes: async () => await api.get<DrinkVolume[]>('/drink-volumes'),
  getDrinkVolume: async (id: string) => await api.get<DrinkVolume>(`/drink-volumes/${id}`),

  getContainerTypes: async () => await api.get<ContainerType[]>('/container-types'),
  getContainerType: async (id: string) => await api.get<ContainerType>(`/container-types/${id}`),

  getTemperatureProfile: async (id: string) =>
    await api.get<TemperatureProfileEntity>(`/temperature-profiles/${id}`),
  getOrdersReadable: async () => await api.get<OrderReadableModel[]>('/orders-readable'),
  getAnalytics: async (params: { from: Date; to: Date }) =>
    await api.get<AnalyticsData>('/analytics', {
      params: {
        from: params.from.toISOString(),
        to: params.to.toISOString(),
      },
      timeout: 30000,
      headers: {
        'Cache-Control': 'no-cache',
      },
    }),
  getSupportedLanguages: async () => await api.get<SupportedLanguage[]>('/supported-languages'),
  getSupportedLanguage: async (id: string) => await api.get<SupportedLanguage>(`/supported-languages/${id}`),
  createSupportedLanguage: async (data: SupportedLanguageInput) =>
    await api.post<SupportedLanguage>('/supported-languages', data),
  updateSupportedLanguage: async (id: string, data: SupportedLanguageUpdate) =>
    await api.patch<SupportedLanguage>(`/supported-languages/${id}`, data),
  deleteSupportedLanguage: async (id: string) => await api.delete<void>(`/supported-languages/${id}`),
});

// ======================================================================== //
// NOTE: USAGE EXAMPLES..

// Example usage in a hook with the new utility
const __useGetDrinkType = (id: string) => {
  return useEndpointQuery(['drinkType', id], () => EndpointHelper.getDrinkType(id), {
    maxRetries: 2,
    enabled: !!id,
  });
};

// Example of a rate-limited endpoint with custom retry logic
const __useGetAnalytics = (params: { from: Date; to: Date }) => {
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
