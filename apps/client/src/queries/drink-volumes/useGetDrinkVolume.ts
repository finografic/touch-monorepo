import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { DrinkVolume, ApiResponse, ErrorResponse } from '@touch/shared/types';
import { GET_DRINK_VOLUMES_QUERYKEY } from '.';
import { api } from 'lib/api';
import { transformAxiosError } from 'lib/api/api.utils';

const getDrinkVolume = async (id: string) => {
  try {
    const response = await api.get<ApiResponse<DrinkVolume>>(`/drink-volumes/${id}`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch drink volume: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    throw transformAxiosError(error);
  }
};

export const useGetDrinkVolume = (id: string): UseQueryResult<DrinkVolume, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_DRINK_VOLUMES_QUERYKEY, id],
    queryFn: async () => getDrinkVolume(id),
    enabled: !!id,
  });
};
