import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';
import { EndpointHelper } from 'api/api.endpoints';

import type { DrinkType } from 'types/models/drink-type.model';
import { GET_DRINK_TYPES_QUERYKEY } from '.';

export const useGetDrinkTypes = (): UseQueryResult<DrinkType[], ErrorResponse> => {
  return useQuery({
    queryKey: GET_DRINK_TYPES_QUERYKEY,
    queryFn: EndpointHelper.getDrinkTypes,
  });
};
