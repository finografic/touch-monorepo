import type { ErrorResponse } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { appConfigurationEndpoints } from 'api/endpoints';

import type { SlotSpecialAppConfiguration, SlotSpecialParam } from 'types/app-configuration.types';
import { SLOT_SPECIAL_CONFIG_KEYS } from 'types/app-configuration.types';
import { APP_CONFIGURATION_QUERY_KEYS } from './index';

/**
 * Get one slot-special app configuration by param (special_grid | special_power | special_alt).
 * Returns config with typed data { slot_number, relay_number }.
 */
export const useGetSlotSpecialConfig = (
  param: SlotSpecialParam,
): UseQueryResult<SlotSpecialAppConfiguration, ErrorResponse> => {
  const key = SLOT_SPECIAL_CONFIG_KEYS[param];
  return useQuery({
    queryKey: APP_CONFIGURATION_QUERY_KEYS.detail(key),
    queryFn: async () => {
      const config = await appConfigurationEndpoints.getByKey(key);
      return {
        ...config,
        data: config.data as unknown as SlotSpecialAppConfiguration['data'],
      };
    },
    enabled: !!param,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
