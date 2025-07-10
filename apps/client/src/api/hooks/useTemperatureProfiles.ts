import { useQuery } from '@tanstack/react-query';
import { api } from 'api';
import { transformAxiosError } from '../api.utils';
import type { TemperatureProfileEntity } from 'types/models/temperature.model';

// Query keys for caching
export const TEMPERATURE_PROFILES_QUERY_KEYS = {
  all: ['temperature-profiles'] as const,
  lists: () => [...TEMPERATURE_PROFILES_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: string) => [...TEMPERATURE_PROFILES_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...TEMPERATURE_PROFILES_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TEMPERATURE_PROFILES_QUERY_KEYS.details(), id] as const,
  byOrder: () => [...TEMPERATURE_PROFILES_QUERY_KEYS.all, 'by-order'] as const,
  byOrderId: (orderId: string) => [...TEMPERATURE_PROFILES_QUERY_KEYS.byOrder(), orderId] as const,
};

/**
 * Hook to fetch temperature profiles for a specific order
 */
export const useGetTemperatureProfilesByOrderId = (orderId: string | undefined) => {
  return useQuery({
    queryKey: TEMPERATURE_PROFILES_QUERY_KEYS.byOrderId(orderId || ''),
    queryFn: async (): Promise<TemperatureProfileEntity[]> => {
      try {
        const response = await api.get(`/orders/${orderId}/temperature-profiles`);
        return response.data.data || response.data;
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
