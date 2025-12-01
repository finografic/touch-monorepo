import type { ErrorResponse } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
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
      // Fetch client returns data directly
      const data = await api.get<DrinkSubtype[] | SubtypesResponse>(`/drink-types/${drinkTypeId}/subtypes`);

      // Handle both structures for safety (though server returns array)
      if (Array.isArray(data)) {
        return data;
      }
      // Fallback: if wrapped in object { data: [...], success: true }
      return (data as SubtypesResponse)?.data || [];
    },
    enabled: enabled !== false && !!drinkTypeId,
  });
};
