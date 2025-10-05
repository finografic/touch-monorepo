import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';
import { SLOT_CONFIGURATIONS_QUERY_KEYS } from '.';
import { api } from 'api';
import { transformAxiosError } from '@workspace/core/api';
import type { SlotConfiguration } from 'types/slot-config.types';

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
