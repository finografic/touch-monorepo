import type { ErrorResponse } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { containerTypesEndpoints, type ContainerType } from 'api/endpoints';
import { GET_CONTAINER_TYPES_QUERYKEY } from '.';

/**
 * Get all container types
 */
export const useGetContainerTypes = (): UseQueryResult<ContainerType[], ErrorResponse> => {
  return useQuery({
    queryKey: GET_CONTAINER_TYPES_QUERYKEY,
    queryFn: containerTypesEndpoints.getAll,
  });
};
