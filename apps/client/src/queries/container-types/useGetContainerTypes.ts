import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';
import { transformAxiosError } from '@workspace/core/api';
import { api } from 'api';

import type { ContainerType } from 'types/models/container.model';
import { GET_CONTAINER_TYPES_QUERYKEY } from '.';

const getContainerTypes = async () => {
  try {
    const response = await api.get<ContainerType[]>('/container-types');
    if (response.status !== 200) {
      throw new Error(`Failed to fetch container types: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    throw transformAxiosError(error);
  }
};

export const useGetContainerTypes = (): UseQueryResult<ContainerType[], ErrorResponse> => {
  return useQuery({
    queryKey: GET_CONTAINER_TYPES_QUERYKEY,
    queryFn: async () => getContainerTypes(),
  });
};
