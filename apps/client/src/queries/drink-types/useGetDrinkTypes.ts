import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { DrinkType, ApiResponse, ErrorResponse } from '@touch/shared/types';
import { AxiosError } from 'axios';
import { GET_DRINK_TYPES_QUERYKEY } from '.';
import { api } from 'lib/api';

const getDrinkTypes = async () => {
  try {
    const response = await api.get<ApiResponse<DrinkType[]>>('/drink-types');
    if (response.status !== 200) {
      throw new Error(`Failed to fetch drink types: ${response.statusText}`);
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

export const useGetDrinkTypes = (): UseQueryResult<DrinkType[], ErrorResponse> => {
  return useQuery({
    queryKey: GET_DRINK_TYPES_QUERYKEY,
    queryFn: async () => getDrinkTypes(),
  });
};
