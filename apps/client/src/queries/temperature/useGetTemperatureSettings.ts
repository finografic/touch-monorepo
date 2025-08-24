import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { ApiResponse, ErrorResponse } from '@workspace/core/api';
import { api } from 'api';
import { transformAxiosError } from 'src/api/api.utils';
import { GET_TEMPERATURE_SETTINGS_QUERYKEY } from '.';

export interface TemperatureSettings {
  defaultTempConsume: number;
  minTempConsume: number;
  maxTempConsume: number;
  defaultTempFreeze?: number;
}

export interface GetTemperatureSettingsRequest {
  drinkTypeId: string;
  drinkSubtypeId?: string;
  containerTypeId: string;
  volumeId: string;
}

const getTemperatureSettings = async (
  params: GetTemperatureSettingsRequest,
): Promise<ApiResponse<TemperatureSettings>> => {
  try {
    log('__DEV: useGetTemperatureSettings - params', 'orange', params);
    const response = await api.get<ApiResponse<TemperatureSettings>>('/temperature/settings', { params });
    return response.data;
  } catch (error) {
    throw transformAxiosError(error);
  }
};

export const useGetTemperatureSettings = (
  params: GetTemperatureSettingsRequest,
): UseQueryResult<ApiResponse<TemperatureSettings>, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_TEMPERATURE_SETTINGS_QUERYKEY, params],
    queryFn: async () => await getTemperatureSettings(params),
    enabled: Boolean(params?.drinkTypeId && params?.containerTypeId && params?.volumeId),
  });
};
