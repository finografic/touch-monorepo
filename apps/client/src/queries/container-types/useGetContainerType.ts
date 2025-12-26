import type { ErrorResponse } from '@workspace/core/api';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { EndpointsContainerType } from 'api/endpoints';
import type { ContainerType } from 'types/models/container.model';
import { GET_CONTAINER_TYPES_QUERYKEY } from '.';

export const useGetContainerType = (id: string): UseQueryResult<ContainerType, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_CONTAINER_TYPES_QUERYKEY, id],
    queryFn: () => EndpointsContainerType.getById(id),
    enabled: !!id,
  });
};
