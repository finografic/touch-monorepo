import type { ErrorResponse } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { appConfigurationEndpoints } from 'api/endpoints';
import type { AppConfiguration } from 'types/app-configuration.types';

import { APP_CONFIGURATION_QUERY_KEYS } from './index';

/**
 * Get all app configuration entries
 */
export const useGetAppConfigurations = (): UseQueryResult<AppConfiguration[], ErrorResponse> => {
  return useQuery({
    queryKey: APP_CONFIGURATION_QUERY_KEYS.list(),
    queryFn: appConfigurationEndpoints.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
