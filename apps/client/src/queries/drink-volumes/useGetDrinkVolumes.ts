import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, ErrorResponse } from '@workspace/core/api';
import { transformAxiosError } from '@workspace/core/api';
import { api } from 'api';

import type { DrinkVolume } from 'types/models/volume.model';

import { GET_DRINK_VOLUMES_QUERYKEY } from '.';

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
