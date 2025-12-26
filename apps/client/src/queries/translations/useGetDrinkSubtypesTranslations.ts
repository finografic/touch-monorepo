import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';

import { ADMIN_DATA_QUERY_CONFIG } from 'config/api';
import { EndpointsDrinkSubtype } from 'api/endpoints';
import type { DrinkSubtype } from 'types/models/drink-type.model';
import { GET_DRINK_SUBTYPES_TRANSLATIONS_QUERYKEY } from '.';

export const useGetDrinkSubtypesTranslations = (): UseQueryResult<DrinkSubtype[], ErrorResponse> => {
  return useQuery({
    queryKey: GET_DRINK_SUBTYPES_TRANSLATIONS_QUERYKEY,
    queryFn: EndpointsDrinkSubtype.getAll,
    ...ADMIN_DATA_QUERY_CONFIG,
  });
};
