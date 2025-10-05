import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { ApiResponse, ErrorResponse } from '@workspace/core/api';
import type { ContainerType } from 'types/orders.types';
import { GET_CONTAINER_TYPES_QUERYKEY } from '.';
import { api } from 'api';
import { transformAxiosError } from '@workspace/core/api';

const getContainerType = async (id: string) => {
  try {
    const response = await api.get<ApiResponse<ContainerType>>(`/container-types/${id}`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch container type: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    throw transformAxiosError(error);
  }
};

export const useGetContainerType = (id: string): UseQueryResult<ContainerType, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_CONTAINER_TYPES_QUERYKEY, id],
    queryFn: async () => getContainerType(id),
    enabled: !!id,
  });
};
