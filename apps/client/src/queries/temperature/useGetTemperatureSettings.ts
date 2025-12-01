import type { ErrorResponse } from '@workspace/core/api';
import { transformFetchError } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

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
): Promise<TemperatureSettings> => {
  try {
    // Fetch client returns data directly (unwraps ApiResponse)
    return await api.get<TemperatureSettings>('/temperature/settings', { params });
  } catch (error) {
    throw transformFetchError(error);
  }
};

export const useGetTemperatureSettings = (
  params: GetTemperatureSettingsRequest,
): UseQueryResult<TemperatureSettings, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_TEMPERATURE_SETTINGS_QUERYKEY, params],
    queryFn: async () => await getTemperatureSettings(params),
    enabled: Boolean(params?.drinkTypeId && params?.containerTypeId && params?.volumeId),
  });
};
