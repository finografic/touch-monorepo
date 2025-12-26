import type { ErrorResponse } from '@workspace/core/api';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { EndpointsVolume } from 'api/endpoints';
import type { DrinkVolume } from 'types/models/volume.model';
import { GET_DRINK_VOLUMES_QUERYKEY } from '.';

export const useGetDrinkVolumes = (): UseQueryResult<DrinkVolume[], ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_DRINK_VOLUMES_QUERYKEY],
    queryFn: EndpointsVolume.getAll,
  });
};
