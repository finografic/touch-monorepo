import { useQuery } from '@tanstack/react-query';
import type { TemperatureProfile } from 'types/temperature.types';
import { api } from 'api';
import { createTemperatureQuery } from 'api/query';

export const GET_TEMPERATURE_PROFILES_QUERYKEY = ['temperature-profiles'] as const;

interface UseGetTemperatureProfilesOptions {
  initial?: number;
  final?: number;
  enabled?: boolean;
}

export const useGetTemperatureProfiles = ({ initial, final, enabled }: UseGetTemperatureProfilesOptions) => {
  return useQuery({
    queryKey: [...GET_TEMPERATURE_PROFILES_QUERYKEY, initial, final],
    queryFn: async () => {
      if (!initial || !final) {
        throw new Error('Both initial and final temperatures are required');
      }

      const queryString = createTemperatureQuery(initial, final);
      const response = await api.get<TemperatureProfile[]>(`/temperature-profiles?${queryString}`);

      log('__DEV: RES', 'lime', response?.data);

      if (response.status !== 200) {
        throw new Error('Failed to fetch temperature profiles');
      }

      if (!response.data?.length) {
        throw new Error('No temperature profiles found');
      }

      // Return the profiles in order [initial, final]
      return response.data.sort((a, b) => {
        if (a.temperature === initial) return -1;
        if (b.temperature === initial) return 1;
        return 0;
      });
    },
    enabled: enabled ?? Boolean(initial && final),
  });
};
