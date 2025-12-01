import type { ErrorResponse } from '@workspace/core/api';
import { transformFetchError } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

import type { ContainerType } from 'types/models/container.model';
import { GET_CONTAINER_TYPES_QUERYKEY } from '.';

const getContainerTypes = async () => {
  try {
    // Fetch client returns data directly and handles errors
    return await api.get<ContainerType[]>('/container-types');
  } catch (error) {
    throw transformFetchError(error);
  }
};

export const useGetContainerTypes = (): UseQueryResult<ContainerType[], ErrorResponse> => {
  return useQuery({
    queryKey: GET_CONTAINER_TYPES_QUERYKEY,
    queryFn: async () => getContainerTypes(),
  });
};
