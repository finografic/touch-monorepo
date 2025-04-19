import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { ContainerType, ApiResponse, ErrorResponse } from '@touch/shared/types';
import { GET_CONTAINER_TYPES_QUERYKEY } from '.';
import { api } from 'lib/api';
import { transformAxiosError } from 'lib/api/api.utils';

const getContainerTypes = async () => {
  try {
    const response = await api.get<ApiResponse<ContainerType[]>>('/container-types');
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
