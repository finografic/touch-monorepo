import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { ErrorResponse } from '@touch/shared/types';
import type { ApiResponse } from '@touch/shared/types/api.types';
import { api } from 'src/api';
import { transformAxiosError } from 'src/api/api.utils';

export interface TemperatureSettings {
  defaultConsumptionTemp: number;
  minConsumptionTemp: number;
  maxConsumptionTemp: number;
  defaultFreezeTemp?: number;
}

export interface GetTemperatureSettingsRequest {
  drinkTypeId: string;
  drinkSubtypeId?: string;
  containerTypeId: string;
  volumeId: string;
}

const getTemperatureSettings = async (
  request: GetTemperatureSettingsRequest,
): Promise<TemperatureSettings> => {
  try {
    const response = await api.get<ApiResponse<TemperatureSettings>>('/temperature/settings', {
      params: request,
    });
    if (response.status !== 200) {
      throw new Error(`Failed to fetch temperature settings: ${response.statusText}`);
    }
    return response.data.data;
  } catch (error) {
    throw transformAxiosError(error);
  }
};

export const useTemperatureSettings = (
  params: GetTemperatureSettingsRequest,
): UseQueryResult<TemperatureSettings, ErrorResponse> => {
  return useQuery({
    queryKey: ['temperatureSettings', params],
    queryFn: () => getTemperatureSettings(params),
    enabled: Boolean(params.drinkTypeId && params.containerTypeId && params.volumeId),
  });
};
