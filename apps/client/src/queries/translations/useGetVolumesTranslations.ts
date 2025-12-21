import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';

import { ADMIN_DATA_QUERY_CONFIG } from 'config/api';
import { volumeEndpoints, type VolumeTranslation } from 'api/endpoints';
import { GET_VOLUMES_TRANSLATIONS_QUERYKEY } from '.';

/**
 * Get all volumes for translation
 */
export const useGetVolumesTranslations = (): UseQueryResult<VolumeTranslation[], ErrorResponse> => {
  return useQuery({
    queryKey: GET_VOLUMES_TRANSLATIONS_QUERYKEY,
    queryFn: volumeEndpoints.getVolumes,
    ...ADMIN_DATA_QUERY_CONFIG,
  });
};

