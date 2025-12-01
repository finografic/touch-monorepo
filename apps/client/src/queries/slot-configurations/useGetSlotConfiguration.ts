import type { ErrorResponse } from '@workspace/core/api';
import { transformFetchError } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

import type { SlotConfiguration } from 'types/slot-config.types';
import { SLOT_CONFIGURATIONS_QUERY_KEYS } from '.';

const getSlotConfiguration = async (slotNumber: number) => {
  try {
    // Fetch client returns data directly and handles errors
    return await api.get<SlotConfiguration>(`/slot-configurations/${slotNumber}`);
  } catch (error) {
    throw transformFetchError(error);
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
