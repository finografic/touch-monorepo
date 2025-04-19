import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { DrinkVolume, ApiResponse, ErrorResponse } from '@touch/shared/types';
import { GET_DRINK_VOLUMES_QUERYKEY } from '.';
import { api } from 'lib/api';
import { transformAxiosError } from 'lib/api/api.utils';

const getDrinkVolumes = async () => {
  try {
    const response = await api.get<ApiResponse<DrinkVolume[]>>('/drink-volumes');
    if (response.status !== 200) {
      throw new Error(`Failed to fetch drink volumes: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    throw transformAxiosError(error);
  }
};

export const useGetDrinkVolumes = (): UseQueryResult<DrinkVolume[], ErrorResponse> => {
  return useQuery({
    queryKey: GET_DRINK_VOLUMES_QUERYKEY,
    queryFn: async () => getDrinkVolumes(),
  });
};
