import type { ErrorResponse } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { type ContainerType, EndpointsContainerType } from 'api/endpoints';

import { ADMIN_DATA_QUERY_CONFIG } from 'config/api';
import { GET_CONTAINER_TYPES_TRANSLATIONS_QUERYKEY } from '.';

/**
 * Get all container types for translation
 */
export const useGetContainerTypesTranslations = (): UseQueryResult<ContainerType[], ErrorResponse> => {
  return useQuery({
    queryKey: GET_CONTAINER_TYPES_TRANSLATIONS_QUERYKEY,
    queryFn: EndpointsContainerType.getAll,
    ...ADMIN_DATA_QUERY_CONFIG,
  });
};
