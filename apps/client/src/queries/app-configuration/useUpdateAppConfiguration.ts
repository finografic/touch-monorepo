import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appConfigurationEndpoints } from 'api/endpoints';
import type { AppConfiguration } from 'types/app-configuration.types';
import type { UpdateAppConfigurationRequest } from 'types/app-configuration.types';

import { APP_CONFIGURATION_QUERY_KEYS } from './index';

/**
 * Update an app configuration (partial update)
 */
export const useUpdateAppConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppConfigurationRequest }) =>
      appConfigurationEndpoints.update(id, data),
    onSuccess: (updated: AppConfiguration) => {
      queryClient.invalidateQueries({ queryKey: APP_CONFIGURATION_QUERY_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: APP_CONFIGURATION_QUERY_KEYS.detail(updated.name) });
    },
  });
};
