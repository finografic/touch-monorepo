import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '@workspace/core/api';
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
  id?: string;
  enabled?: boolean;
}

export const useGetTemperatureProfile = ({ id, enabled }: UseGetTemperatureProfileOptions) => {
  return useQuery({
    queryKey: [...GET_TEMPERATURE_PROFILE_QUERYKEY, id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<TemperatureProfile[]>>(`/temperature-profiles/${id}`);

      if (response.status !== 200) {
        throw new Error('Failed to fetch temperature profile');
      }

      if (!response.data.data?.length) {
        throw new Error('No temperature profile found');
      }

      if (response.data.data.length > 1) {
        console.warn(
          'Multiple temperature profiles found when expecting single profile. Using first profile.',
        );
      }

      // Always return the first profile
      return response.data.data[0];
    },
    enabled: enabled ?? Boolean(id),
  });
};
