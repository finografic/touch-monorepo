import type { ApiResponse, ErrorResponse } from '@workspace/core/api';
import { transformAxiosError } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

import type { DrinkVolume } from 'types/models/volume.model';
import { GET_DRINK_VOLUMES_QUERYKEY } from '.';

const getDrinkVolume = async (id: string) => {
  try {
    const response = await api.get<DrinkVolume>(`/drink-volumes/${id}`);
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
