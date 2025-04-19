import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { ErrorResponse } from '@touch/shared/types';
import type { ApiResponse } from '@touch/shared/types/api.types';
import type { DrinkType } from 'types/models/drink-type.model';
import { GET_DRINK_TYPES_QUERYKEY } from '.';
import { api } from 'lib/api';
import { transformAxiosError } from 'lib/api/api.utils';

const getDrinkTypes = async () => {
  try {
    const response = await api.get<ApiResponse<DrinkType[]>>('/drink-types');
    if (response.status !== 200) {
      throw new Error(`Failed to fetch drink types: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    throw transformAxiosError(error);
  }
};

export const useGetDrinkTypes = (): UseQueryResult<DrinkType[], ErrorResponse> => {
  return useQuery({
    queryKey: GET_DRINK_TYPES_QUERYKEY,
    queryFn: async () => getDrinkTypes(),
  });
};
