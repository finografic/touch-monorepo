import type { ErrorResponse } from '@workspace/core/api';
import { transformAxiosError } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

import type { SlotConfiguration } from 'types/slot-config.types';
import { SLOT_CONFIGURATIONS_QUERY_KEYS } from '.';

const getSlotConfiguration = async (slotNumber: number) => {
  try {
    const response = await api.get<SlotConfiguration>(`/slot-configurations/${slotNumber}`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch slot configuration: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    throw transformAxiosError(error);
  }
};

export const useGetSlotConfiguration = (
  slotNumber: number,
): UseQueryResult<SlotConfiguration, ErrorResponse> => {
  return useQuery({
    queryKey: SLOT_CONFIGURATIONS_QUERY_KEYS.detail(slotNumber),
    queryFn: async () => getSlotConfiguration(slotNumber),
  });
};
