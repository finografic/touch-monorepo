import type { ErrorResponse } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { EndpointsVolume } from 'api/endpoints';

import type { DrinkVolume } from 'types/models/volume.model';
import { ADMIN_DATA_QUERY_CONFIG } from 'config/api';
import { GET_VOLUMES_TRANSLATIONS_QUERYKEY } from '.';

export const useGetVolumesTranslations = (): UseQueryResult<DrinkVolume[], ErrorResponse> => {
  return useQuery({
    queryKey: GET_VOLUMES_TRANSLATIONS_QUERYKEY,
    queryFn: EndpointsVolume.getAll,
    ...ADMIN_DATA_QUERY_CONFIG,
  });
};
