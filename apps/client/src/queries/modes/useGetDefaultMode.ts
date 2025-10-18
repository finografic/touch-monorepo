import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';
import { transformAxiosError } from '@workspace/core/api';
import { api } from 'api';

import type { ModeModel } from 'types/models/mode.model';

import { GET_MODES_QUERYKEY } from '.';

const getDefaultMode = async (): Promise<ModeModel | null> => {
  try {
    const response = await api.get<ModeModel[]>('/modes');
    if (response.status !== 200) {
      throw new Error(`Failed to fetch modes: ${response.statusText}`);
    }

    const defaultMode = response.data.find((mode) => mode.isDefault);
    return defaultMode || null;
  } catch (error) {
    console.error('🔍 getDefaultMode: Error occurred:', error);
    throw transformAxiosError(error);
  }
};

export const useGetDefaultMode = (): UseQueryResult<ModeModel | null, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_MODES_QUERYKEY, 'default'],
    queryFn: async () => {
      return getDefaultMode();
    },
    enabled: true,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
