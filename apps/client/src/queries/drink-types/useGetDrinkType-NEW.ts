import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { FetchEndpointHelper } from 'api/endpoints.fetch';
import type { ErrorResponse } from '@workspace/core/api';

import type { DrinkType } from 'types/models/drink-type.model';

import { DrinkTypeDTO } from './DrinkTypes.dto';
import { GET_DRINK_TYPES_QUERYKEY } from '.';

export const useGetDrinkType = (id: string): UseQueryResult<DrinkType, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_DRINK_TYPES_QUERYKEY, id],
    queryFn: () => FetchEndpointHelper.getDrinkType(id),
    enabled: !!id,
    select: (data) => DrinkTypeDTO.fromApi(data),
  });
};
