import type { ErrorResponse } from '@workspace/core/api';
import { transformFetchError } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

import type { SlotConfiguration } from 'types/slot-config.types';
import { SLOT_CONFIGURATIONS_QUERY_KEYS } from '.';

const getSlotConfigurations = async () => {
  try {
    // Fetch client returns data directly and handles errors
    return await api.get<SlotConfiguration[]>('/slot-configurations');
  } catch (error) {
    throw transformFetchError(error);
  }
};

export const useGetSlotConfigurations = (): UseQueryResult<SlotConfiguration[], ErrorResponse> => {
  return useQuery({
    queryKey: SLOT_CONFIGURATIONS_QUERY_KEYS.lists(),
    queryFn: getSlotConfigurations,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
