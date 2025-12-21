import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';

import { ADMIN_DATA_QUERY_CONFIG } from 'config/api';
import { drinkSubtypeEndpoints, type DrinkSubtypeTranslation } from 'api/endpoints';
import { GET_DRINK_SUBTYPES_TRANSLATIONS_QUERYKEY } from '.';

/**
 * Get all drink subtypes for translation
 */
export const useGetDrinkSubtypesTranslations = (): UseQueryResult<
  DrinkSubtypeTranslation[],
  ErrorResponse
> => {
  return useQuery({
    queryKey: GET_DRINK_SUBTYPES_TRANSLATIONS_QUERYKEY,
    queryFn: drinkSubtypeEndpoints.getDrinkSubtypes,
    ...ADMIN_DATA_QUERY_CONFIG,
  });
};

