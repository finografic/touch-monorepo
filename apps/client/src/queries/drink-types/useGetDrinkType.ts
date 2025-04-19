import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { ApiResponse, ErrorResponse } from '@touch/shared/types';
import { GET_DRINK_TYPES_QUERYKEY } from '.';
import { api } from 'lib/api';
import { transformAxiosError } from 'lib/api/api.utils';
import type { DrinkType } from 'types/models/models.types';

const getDrinkType = async (id: string) => {
  try {
    const response = await api.get<ApiResponse<DrinkType>>(`/drink-types/${id}`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch drink type: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    throw transformAxiosError(error);
  }
};

export const useGetDrinkType = (id: string): UseQueryResult<DrinkType, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_DRINK_TYPES_QUERYKEY, id],
    queryFn: async () => getDrinkType(id),
    enabled: !!id,
  });
};
