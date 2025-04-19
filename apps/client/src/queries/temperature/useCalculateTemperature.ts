import { useMutation } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import type { ErrorResponse } from '@touch/shared/types';
import type { ApiResponse } from '@touch/shared/types/api.types';
import { api } from 'lib/api';
import { transformAxiosError } from 'lib/api/api.utils';

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
  return useMutation({
    mutationFn: calculateTemperature,
  });
};
