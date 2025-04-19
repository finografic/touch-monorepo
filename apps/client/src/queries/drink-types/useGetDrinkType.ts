import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { DrinkType, ApiResponse, ErrorResponse } from '@touch/shared/types';
import { AxiosError } from 'axios';
import { GET_DRINK_TYPES_QUERYKEY } from '.';
import { api } from 'lib/api';

const getDrinkType = async (id: string) => {
  try {
    const response = await api.get<ApiResponse<DrinkType>>(`/drink-types/${id}`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch drink type: ${response.statusText}`);
    }
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      } as ErrorResponse;
    }
    throw error;
  }
};

export const useGetDrinkType = (id: string): UseQueryResult<DrinkType, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_DRINK_TYPES_QUERYKEY, id],
    queryFn: async () => getDrinkType(id),
    enabled: !!id,
  });
};
