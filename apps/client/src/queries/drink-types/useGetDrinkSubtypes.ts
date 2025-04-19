import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { ErrorResponse } from '@touch/shared/types';
import type { ApiResponse } from '@touch/shared/types/api.types';
import type { DrinkSubtypeEntity } from '@touch/server/types/entities/drink-type.entity';
import { api } from 'lib/api';
import type { DrinkSubtype } from 'types/models/drink-type.model';
import { DrinkTypeDTO } from './DrinkTypes.dto';

export const useGetDrinkSubtypes = (drinkTypeId?: string): UseQueryResult<DrinkSubtype[], ErrorResponse> => {
  return useQuery({
    queryKey: ['drinkSubtypes', drinkTypeId],
    queryFn: async () => {
      if (!drinkTypeId) {
        return [];
      }
      const response = await api.get<ApiResponse<DrinkSubtypeEntity[]>>(
        `/drink-types/${drinkTypeId}/subtypes`,
      );
      return response.data.data.map((subtype) => DrinkTypeDTO.fromSubtypeEntity(subtype));
    },
    enabled: !!drinkTypeId,
  });
};
