import type { ErrorResponse } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { DrinkType } from 'types/models/drink-type.model';

import { EndpointsDrinkType, type DrinkTypeTranslation } from 'api/endpoints';
import { GET_DRINK_TYPES_QUERYKEY } from '.';

/**
 * Get all drink types
 */
export const useGetDrinkTypes = (): UseQueryResult<DrinkTypeTranslation[], ErrorResponse> => {
  // export const useGetDrinkTypes = (): UseQueryResult<DrinkType[], ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_DRINK_TYPES_QUERYKEY],
    queryFn: EndpointsDrinkType.getAll,
  });
};
