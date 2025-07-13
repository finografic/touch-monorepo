import { useQuery } from '@tanstack/react-query';
import type { TemperatureProfile } from 'types/temperature.types';
import { api } from 'api';
import { createTemperatureQuery } from 'api/query';

export const GET_TEMPERATURE_PROFILES_QUERYKEY = ['temperature-profiles'] as const;

interface UseGetTemperatureProfilesOptions {
  orderId: string; // <-- Required orderId
  initial?: number;
  final?: number;
  enabled?: boolean;
}

export const useGetTemperatureProfiles = ({
  orderId,
  initial,
  final,
  enabled,
}: UseGetTemperatureProfilesOptions) => {
  return useQuery({
    queryKey: [...GET_TEMPERATURE_PROFILES_QUERYKEY, orderId],
    queryFn: async () => {
      if (!orderId) {
        throw new Error('orderId is required');
      }

      // Only filter by orderId, not by temperature
      const url = `/temperature-profiles?orderId=${encodeURIComponent(orderId)}`;

      log('__DEV: useGetTemperatureProfiles - url', 'magenta', url);
      const response = await api.get<TemperatureProfile[]>(url);

      if (response.status !== 200) {
        throw new Error('Failed to fetch temperature profiles');
      }

      if (!response.data?.length) {
        throw new Error('No temperature profiles found');
      }

      // Return the profiles sorted by temperature descending
      return response.data.sort((a, b) => b.temperature - a.temperature);
    },
    enabled: enabled ?? Boolean(orderId),
  });
};
