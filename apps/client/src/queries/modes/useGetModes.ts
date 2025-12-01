import type { ErrorResponse } from '@workspace/core/api';
import { transformFetchError } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

import type { ModeModel } from 'types/models/mode.model';
import { GET_MODES_QUERYKEY } from '.';

const getModes = async (): Promise<ModeModel[]> => {
  try {
    // Fetch client returns data directly and handles errors
    return await api.get<ModeModel[]>('/modes');
  } catch (error) {
    throw transformFetchError(error);
  }
};

export const useGetModes = (): UseQueryResult<ModeModel[], ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_MODES_QUERYKEY],
    queryFn: async () => getModes(),
  });
};
