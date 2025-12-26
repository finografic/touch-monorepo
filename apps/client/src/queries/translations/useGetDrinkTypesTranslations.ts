import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';

import { ADMIN_DATA_QUERY_CONFIG } from 'config/api';
import { EndpointsDrinkType } from 'api/endpoints';
import type { DrinkType } from 'types/models/drink-type.model';
import { GET_DRINK_TYPES_TRANSLATIONS_QUERYKEY } from '.';

export const useGetDrinkTypesTranslations = (): UseQueryResult<DrinkType[], ErrorResponse> => {
  return useQuery({
    queryKey: GET_DRINK_TYPES_TRANSLATIONS_QUERYKEY,
    queryFn: EndpointsDrinkType.getAll,
    ...ADMIN_DATA_QUERY_CONFIG,
  });
};
