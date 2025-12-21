import type { ErrorResponse } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { translationsUiEndpoints } from 'api/endpoints';
import type { TranslationsModel } from 'types/models/translations.model';
import { GET_TRANSLATIONS_UI_QUERYKEY } from '.';

/**
 * Get a single UI translation by ID
 */
export const useGetTranslationUi = (id: string): UseQueryResult<TranslationsModel, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_TRANSLATIONS_UI_QUERYKEY, id],
    queryFn: () => translationsUiEndpoints.getById(id),
    enabled: !!id,
  });
};
