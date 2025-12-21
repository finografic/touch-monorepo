import type { ErrorResponse } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { slotConfigurationsEndpoints } from 'api/endpoints';
import type { SlotConfiguration } from 'types/slot-config.types';
import { SLOT_CONFIGURATIONS_QUERY_KEYS } from '.';

/**
 * Get all slot configurations
 */
export const useGetSlotConfigurations = (): UseQueryResult<SlotConfiguration[], ErrorResponse> => {
  return useQuery({
    queryKey: SLOT_CONFIGURATIONS_QUERY_KEYS.lists(),
    queryFn: slotConfigurationsEndpoints.getAll,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
