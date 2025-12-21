import type { ErrorResponse } from '@workspace/core/api';
import { transformFetchError } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

import type { TranslationsModel } from 'types/models/translations.model';
import { GET_TRANSLATIONS_UI_QUERYKEY } from '.';
import { TranslationsDto } from './translations-ui.dto';

const getTranslationUi = async (id: string) => {
  try {
    // Fetch client returns data directly and handles errors
    const entity = await api.get<any>(`/translations-ui/${id}`);
    // Transform entity using DTO to parse translations and normalize dates
    return TranslationsDto.fromApi(entity) as TranslationsModel;
  } catch (error) {
    throw transformFetchError(error);
  }
};

export const useGetTranslationUi = (id: string): UseQueryResult<TranslationsModel, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_TRANSLATIONS_UI_QUERYKEY, id],
    queryFn: async () => getTranslationUi(id),
    enabled: !!id,
  });
};
