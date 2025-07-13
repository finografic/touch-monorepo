import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '@workspace/core/api';
import { api } from 'api';
import { GET_TEMPERATURE_PROFILE_QUERYKEY } from 'queries/temperature';

export interface TemperatureProfile {
  id: string;
  temperature: number;
  timeA: number;
  timeB: number;
  timeC: number;
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
      log(
        '__DEV: useGetTemperatureProfile - by-tempterature',
        'hotpink',
        `/temperature-profiles/by-temperature/${temperature}`,
      );
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
