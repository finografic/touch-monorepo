import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { ERROR_CODE_MAP } from '@touch/shared/types';
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
    return response.data;
  } catch (error) {
    // Since we're spreading the error in the interceptor, we can access its properties directly
    const axiosError = error as AxiosError;
    throw {
      message: axiosError.message || 'An unknown error occurred',
      code: axiosError.code as keyof typeof ERROR_CODE_MAP,
      status:
        axiosError.response?.status || ERROR_CODE_MAP[axiosError.code as keyof typeof ERROR_CODE_MAP] || 500,
    } as ErrorResponse;
  }
};

export const useGetDrinkType = (id: string): UseQueryResult<DrinkType, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_DRINK_TYPES_QUERYKEY, id],
    queryFn: async () => getDrinkType(id),
    enabled: !!id,
  });
};
