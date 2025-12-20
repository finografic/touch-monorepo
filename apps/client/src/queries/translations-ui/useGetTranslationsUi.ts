import type { ErrorResponse } from '@workspace/core/api';
import { transformFetchError } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

import type { TranslationsUiModel } from 'types/models/translations-ui.model';
import { GET_TRANSLATIONS_UI_QUERYKEY } from '.';
import { TranslationsDto } from './translations-ui.dto';

const getTranslationsUi = async () => {
  try {
    // Fetch client returns data directly and handles errors
    const data = await api.get<any[]>('/translations-ui');
    // Transform each entity using DTO to parse translations and normalize dates
    return data.map((entity) => TranslationsDto.fromApi(entity)) as TranslationsUiModel[];
  } catch (error) {
    throw transformFetchError(error);
  }
};

export const useGetTranslationsUi = (): UseQueryResult<TranslationsUiModel[], ErrorResponse> => {
  return useQuery({
    queryKey: GET_TRANSLATIONS_UI_QUERYKEY,
    queryFn: async () => getTranslationsUi(),
  });
};
