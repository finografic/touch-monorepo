import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import type { ApiResponse, ErrorResponse } from '@workspace/core/api';
import { api } from 'api';
import { transformAxiosError } from 'src/api/api.utils';
import { GET_TEMPERATURE_SETTINGS_QUERYKEY } from '.';

export interface CalculateTemperatureRequest {
  drinkTypeId: string;
  drinkSubtypeId?: string;
  containerTypeId: string;
  volumeId: string;
  initialTemp: number;
  targetTemp: number;
}

export interface TemperaturePhase {
  durationSeconds: number;
  startTemp: number;
  endTemp: number;
  description: string;
}

export interface CalculateTemperatureResponse {
  estimatedDurationSeconds: number;
  phases: TemperaturePhase[];
  timeTableId: string;
  recommendations: string[];
}

const calculateTemperature = async (
  request: CalculateTemperatureRequest,
): Promise<CalculateTemperatureResponse> => {
  try {
    log('__DEV: useCalculateTemperature - /temperature/calculate/{request}', 'cyan', request);
    const response = await api.post<ApiResponse<CalculateTemperatureResponse>>(
      '/temperature/calculate',
      request,
    );
    if (response.status !== 200) {
      throw new Error(`Failed to calculate temperature: ${response.statusText}`);
    }
    return response.data.data;
  } catch (error) {
    throw transformAxiosError(error);
  }
};

export const useCalculateTemperature = (): UseMutationResult<
  CalculateTemperatureResponse,
  ErrorResponse,
  CalculateTemperatureRequest
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: calculateTemperature,
    onSuccess: () => {
      // NOTE: refetch temperature settings
      queryClient.invalidateQueries({ queryKey: [...GET_TEMPERATURE_SETTINGS_QUERYKEY] });
    },
  });
};
