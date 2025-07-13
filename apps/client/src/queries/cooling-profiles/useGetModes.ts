import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
// import type { ApiResponse, ErrorResponse } from '@workspace/core/api';
import type { ApiResponse, ErrorResponse } from '@workspace/types';
import { GET_MODES_QUERYKEY } from '.';
import { api } from 'api';
import { transformAxiosError } from 'src/api/api.utils';
import type { Mode } from 'types/models/mode.model';

const getModes = async (): Promise<Mode[]> => {
  try {
    const response = await api.get<ApiResponse<Mode[]>>('/modes');
    if (response.status !== 200) {
      throw new Error(`Failed to fetch modes: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    throw transformAxiosError(error);
  }
};

export const useGetModes = (): UseQueryResult<Mode[], ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_MODES_QUERYKEY],
    queryFn: async () => getModes(),
  });
};
