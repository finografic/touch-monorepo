import type { ErrorResponse } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { slotConfigurationsEndpoints } from 'api/endpoints';
import type { SlotConfiguration } from 'types/slot-config.types';
import { SLOT_CONFIGURATIONS_QUERY_KEYS } from '.';

/**
 * Get a single slot configuration by slot number
 */
export const useGetSlotConfiguration = (slotNumber: number): UseQueryResult<SlotConfiguration, ErrorResponse> => {
  return useQuery({
    queryKey: SLOT_CONFIGURATIONS_QUERY_KEYS.detail(slotNumber),
    queryFn: () => slotConfigurationsEndpoints.getBySlotNumber(slotNumber),
    enabled: slotNumber !== undefined && slotNumber !== null,
  });
};
