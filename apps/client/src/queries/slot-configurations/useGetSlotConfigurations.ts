import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';
import { transformAxiosError } from '@workspace/core/api';
import { api } from 'api';

import type { SlotConfiguration } from 'types/slot-config.types';
import { SLOT_CONFIGURATIONS_QUERY_KEYS } from '.';

const getSlotConfigurations = async () => {
  try {
    const response = await api.get<SlotConfiguration[]>('/slot-configurations');
    if (response.status !== 200) {
      throw new Error(`Failed to fetch slot configurations: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    throw transformAxiosError(error);
  }
};

export const useGetSlotConfigurations = (): UseQueryResult<SlotConfiguration[], ErrorResponse> => {
  return useQuery({
    queryKey: SLOT_CONFIGURATIONS_QUERY_KEYS.lists(),
    queryFn: async () => getSlotConfigurations(),
  });
};
