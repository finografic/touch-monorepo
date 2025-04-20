import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { ErrorResponse } from '@touch/shared/types';
import type { ApiResponse } from '@touch/shared/types/api.types';
import { GET_DRINK_TYPES_QUERYKEY } from '.';
import { api } from 'api';
import { transformAxiosError } from 'src/api/api.utils';
import type { DrinkType } from 'types/models/drink-type.model';
import type { DrinkTypeEntity } from '@touch/server/types/entities/drink-type.entity';
import { DrinkTypeDTO } from './DrinkTypes.dto';

const getDrinkType = async (id: string) => {
  try {
    const response = await api.get<ApiResponse<DrinkTypeEntity>>(`/drink-types/${id}`);
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
    select: (data) => DrinkTypeDTO.fromApi(data),
  });
};
