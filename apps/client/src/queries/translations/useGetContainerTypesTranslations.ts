import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';

import { ADMIN_DATA_QUERY_CONFIG } from 'config/api';
import { EndpointsContainerTypes, type ContainerType } from 'api/endpoints';
import { GET_CONTAINER_TYPES_TRANSLATIONS_QUERYKEY } from '.';

/**
 * Get all container types for translation
 */
export const useGetContainerTypesTranslations = (): UseQueryResult<ContainerType[], ErrorResponse> => {
  return useQuery({
    queryKey: GET_CONTAINER_TYPES_TRANSLATIONS_QUERYKEY,
    queryFn: EndpointsContainerTypes.getAll,
    ...ADMIN_DATA_QUERY_CONFIG,
  });
};
