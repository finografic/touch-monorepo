import type { ErrorResponse } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { EndpointsContainerType, type ContainerType } from 'api/endpoints';
import { GET_CONTAINER_TYPES_QUERYKEY } from '.';

/**
 * Get a single container type by ID
 */
export const useGetContainerType = (id: string): UseQueryResult<ContainerType, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_CONTAINER_TYPES_QUERYKEY, id],
    queryFn: () => EndpointsContainerType.getById(id),
    enabled: !!id,
  });
};
