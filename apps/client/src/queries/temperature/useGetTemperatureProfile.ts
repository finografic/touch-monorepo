import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '@workspace/shared/types/api.types';
import { api } from 'api';

export interface TemperatureProfile {
  id: string;
  temperature: number;
  time_a: number;
  time_b: number;
  time_c: number;
}

export interface TemperaturePhase {
  durationSeconds: number;
  startTemp: number;
  endTemp: number;
  description: string;
}

export const GET_TEMPERATURE_PROFILE_QUERYKEY = ['temperature-profile'];

export const useGetTemperatureProfile = (filters: Record<string, any>) => {
  // Reduce filters to get the most specific temperatureProfileId
  const temperatureProfileId = Object.values(filters).reduce(
    (acc, value) => value?.temperatureProfileId ?? acc,
    '',
  );

  return useQuery({
    queryKey: [...GET_TEMPERATURE_PROFILE_QUERYKEY, temperatureProfileId],
    queryFn: async () => {
      if (!temperatureProfileId) {
        return null;
      }

      const response = await api.get<ApiResponse<TemperatureProfile[]>>(
        `/temperature-profiles/${temperatureProfileId}`,
      );

      if (response.status !== 200) {
        throw new Error('Failed to fetch temperature profile');
      }

      return response.data.data;
    },
    enabled: Boolean(temperatureProfileId),
  });
};
