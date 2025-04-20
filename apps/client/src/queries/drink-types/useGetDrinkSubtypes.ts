import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { ErrorResponse } from '@touch/shared/types';
import { api } from 'src/api';
import type { DrinkSubtype } from 'types/models/drink-type.model';

interface SubtypesResponse {
  data?: DrinkSubtype[];
  success: boolean;
  error?: {
    issues: Array<{
      code: string;
      path: string[];
      message: string;
    }>;
    name: string;
  };
}

export const useGetDrinkSubtypes = (drinkTypeId?: string): UseQueryResult<DrinkSubtype[], ErrorResponse> => {
  return useQuery({
    queryKey: ['drinkSubtypes', drinkTypeId],
    queryFn: async () => {
      if (!drinkTypeId) {
        return [];
      }

      const response = await api.get<SubtypesResponse>(`/drink-types/${drinkTypeId}/subtypes`);

      if (response.status !== 200) {
        throw new Error('Failed to fetch drink subtypes');
      }

      return response.data || [];
    },
    enabled: !!drinkTypeId,
  });
};
