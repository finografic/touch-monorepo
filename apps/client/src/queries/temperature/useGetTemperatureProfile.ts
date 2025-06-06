import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '@workspace/common/api';
import { api } from 'api';
import { GET_TEMPERATURE_PROFILE_QUERYKEY } from 'queries/temperature';

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

interface UseGetTemperatureProfileOptions {
  temperature?: number;
  enabled?: boolean;
}

export const useGetTemperatureProfile = ({ temperature, enabled }: UseGetTemperatureProfileOptions) => {
  return useQuery({
    queryKey: [...GET_TEMPERATURE_PROFILE_QUERYKEY, temperature],
    queryFn: async () => {
      const response = await api.get<ApiResponse<TemperatureProfile>>(
        `/temperature-profiles/by-temperature/${temperature}`,
      );

      if (response.status !== 200) {
        throw new Error('Failed to fetch temperature profile');
      }

      if (!response.data.data) {
        throw new Error('No temperature profile found');
      }

      return response.data.data;
    },
    enabled: enabled ?? Boolean(temperature),
  });
};
