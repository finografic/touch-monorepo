import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '@workspace/shared/types/api.types';
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

export const useGetTemperatureProfile = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [...GET_TEMPERATURE_PROFILE_QUERYKEY, id],
    queryFn: async () => {
      if (!id) {
        return null;
      }

      const response = await api.get<ApiResponse<TemperatureProfile[]>>(`/temperature-profiles/${id}`);

      if (response.status !== 200) {
        throw new Error('Failed to fetch temperature profile');
      }

      return response.data.data;
    },
    enabled: Boolean(id),
  });
};
