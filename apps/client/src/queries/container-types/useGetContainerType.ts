import type { ErrorResponse } from '@workspace/core/api';
import { transformFetchError } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

import type { ContainerType } from 'types/slots.types';
import { GET_CONTAINER_TYPES_QUERYKEY } from '.';

const getContainerType = async (id: string) => {
  try {
    // Fetch client returns data directly and handles errors
    return await api.get<ContainerType>(`/container-types/${id}`);
  } catch (error) {
    throw transformFetchError(error);
  }
};

export const useGetContainerType = (id: string): UseQueryResult<ContainerType, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_CONTAINER_TYPES_QUERYKEY, id],
    queryFn: async () => getContainerType(id),
    enabled: !!id,
  });
};
