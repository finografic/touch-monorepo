import type { ErrorResponse } from '@workspace/core/api';
import { transformFetchError } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

import type { DrinkVolume } from 'types/models/volume.model';
import { GET_DRINK_VOLUMES_QUERYKEY } from '.';

const getDrinkVolume = async (id: string) => {
  try {
    // Fetch client returns data directly and handles errors
    return await api.get<DrinkVolume>(`/drink-volumes/${id}`);
  } catch (error) {
    throw transformFetchError(error);
  }
};

export const useGetDrinkVolume = (id: string): UseQueryResult<DrinkVolume, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_DRINK_VOLUMES_QUERYKEY, id],
    queryFn: async () => getDrinkVolume(id),
    enabled: !!id,
  });
};
