import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appConfigurationEndpoints } from 'api/endpoints';
import type { AppConfiguration } from 'types/app-configuration.types';
import type { SlotSpecialParam, UpdateAppConfigurationRequest } from 'types/app-configuration.types';
import { SLOT_SPECIAL_CONFIG_KEYS } from 'types/app-configuration.types';

import { APP_CONFIGURATION_QUERY_KEYS } from './index';

export interface UpdateSlotSpecialConfigVariables {
  param: SlotSpecialParam;
  id: string;
  data: UpdateAppConfigurationRequest;
}

/**
 * Update a slot-special app configuration (is_active and/or data.slot_number, data.relay_number).
 * Use param to identify which config (special_grid | special_power | special_alt).
 */
export const useUpdateSlotSpecialConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: UpdateSlotSpecialConfigVariables) =>
      appConfigurationEndpoints.update(variables.id, variables.data),
    onSuccess: (updated: AppConfiguration, variables: UpdateSlotSpecialConfigVariables) => {
      queryClient.invalidateQueries({ queryKey: APP_CONFIGURATION_QUERY_KEYS.list() });
      queryClient.invalidateQueries({
        queryKey: APP_CONFIGURATION_QUERY_KEYS.detail(SLOT_SPECIAL_CONFIG_KEYS[variables.param]),
      });
    },
  });
};
