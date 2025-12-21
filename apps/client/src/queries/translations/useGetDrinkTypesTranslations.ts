import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';

import { ADMIN_DATA_QUERY_CONFIG } from 'config/api';
import { drinkTypeEndpoints, type DrinkTypeTranslation } from 'api/endpoints';
import { GET_DRINK_TYPES_TRANSLATIONS_QUERYKEY } from '.';

/**
 * Get all drink types for translation
 */
export const useGetDrinkTypesTranslations = (): UseQueryResult<DrinkTypeTranslation[], ErrorResponse> => {
  return useQuery({
    queryKey: GET_DRINK_TYPES_TRANSLATIONS_QUERYKEY,
    queryFn: drinkTypeEndpoints.getDrinkTypes,
    ...ADMIN_DATA_QUERY_CONFIG,
  });
};

