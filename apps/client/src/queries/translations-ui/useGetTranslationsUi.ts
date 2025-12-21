import type { ErrorResponse } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { translationsUiEndpoints } from 'api/endpoints';
import type { TranslationsModel } from 'types/models/translations.model';
import { GET_TRANSLATIONS_UI_QUERYKEY } from '.';

/**
 * Get all UI translations
 */
export const useGetTranslationsUi = (): UseQueryResult<TranslationsModel[], ErrorResponse> => {
  return useQuery({
    queryKey: GET_TRANSLATIONS_UI_QUERYKEY,
    queryFn: translationsUiEndpoints.getAll,
  });
};
