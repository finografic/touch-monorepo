import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/common/api';
import { api } from 'api';
import type { DrinkSubtype } from 'types/models/drink-type.model';
import { GET_DRINK_SUBTYPES_QUERYKEY } from '.';

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

export const useGetDrinkSubtypes = ({
  drinkTypeId,
  enabled,
}: {
  drinkTypeId: string;
  enabled?: boolean;
}): UseQueryResult<DrinkSubtype[], ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_DRINK_SUBTYPES_QUERYKEY, drinkTypeId],
    queryFn: async () => {
      const response = await api.get<SubtypesResponse>(`/drink-types/${drinkTypeId}/subtypes`);

      if (response.status !== 200) {
        throw new Error('Failed to fetch drink subtypes');
      }

      return response.data || [];
    },
    enabled: enabled !== false && !!drinkTypeId,
  });
};
