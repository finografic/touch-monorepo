import type { ErrorResponse } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { appConfigurationEndpoints } from 'api/endpoints';

import type { AppConfiguration } from 'types/app-configuration.types';
import { APP_CONFIGURATION_QUERY_KEYS } from './index';

/**
 * Get one app configuration by key (name), e.g. 'grid_layout'
 */
export const useGetAppConfigurationByKey = (key: string): UseQueryResult<AppConfiguration, ErrorResponse> => {
  return useQuery({
    queryKey: APP_CONFIGURATION_QUERY_KEYS.detail(key),
    queryFn: () => appConfigurationEndpoints.getByKey(key),
    enabled: !!key,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
