import type { ErrorResponse } from '@workspace/core/api';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { EndpointsDrinkSubtype } from 'api/endpoints';
import type { DrinkSubtype } from 'types/models/drink-type.model';
import { GET_DRINK_SUBTYPES_QUERYKEY } from '.';

export const useGetDrinkSubtypes = ({
  drinkTypeId,
  enabled,
}: {
  drinkTypeId: string;
  enabled?: boolean;
}): UseQueryResult<DrinkSubtype[], ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_DRINK_SUBTYPES_QUERYKEY, drinkTypeId],
    queryFn: () => EndpointsDrinkSubtype.getByDrinkTypeId(drinkTypeId),
    enabled: enabled !== false && !!drinkTypeId,
  });
};
