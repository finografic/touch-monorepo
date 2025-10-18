import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, ErrorResponse } from '@workspace/core/api';
import { transformAxiosError } from '@workspace/core/api';
import { api } from 'api';

import type { ModeModel } from 'types/models/mode.model';

import { GET_MODES_QUERYKEY } from '.';

const getModes = async (): Promise<ModeModel[]> => {
  try {
    const response = await api.get<ModeModel[]>('/modes');
    if (response.status !== 200) {
      throw new Error(`Failed to fetch modes: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    throw transformAxiosError(error);
  }
};

export const useGetModes = (): UseQueryResult<ModeModel[], ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_MODES_QUERYKEY],
    queryFn: async () => getModes(),
  });
};
