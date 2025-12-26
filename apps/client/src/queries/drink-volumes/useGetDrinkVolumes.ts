import type { ErrorResponse } from '@workspace/core/api';
import { transformFetchError } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

import type { DrinkVolume } from 'types/models/volume.model';
import { GET_DRINK_VOLUMES_QUERYKEY } from '.';

const getDrinkVolumes = async () => {
  try {
    // Fetch client returns data directly and handles errors
    return await api.get<DrinkVolume[]>('/drink-volumes');
  } catch (error) {
    throw transformFetchError(error);
  }
};

export const useGetDrinkVolumes = (): UseQueryResult<DrinkVolume[], ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_DRINK_VOLUMES_QUERYKEY],
    queryFn: async () => getDrinkVolumes(),
  });
};
