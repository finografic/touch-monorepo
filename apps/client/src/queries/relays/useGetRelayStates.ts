import { useCallback, useEffect, useState } from 'react';
import type { ErrorResponse } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isRelayNetworkLikeError } from 'api/relay-query.utils';
import { RelaysEndpoints, type RelayState } from 'api/endpoints';

import { useAppConfig } from 'providers/AppConfigProvider';
import { GET_RELAY_STATES_QUERYKEY } from 'queries/relays';

/**
 * Get all relay states with polling support
 */
export const useGetRelayStates = (): UseQueryResult<RelayState[], ErrorResponse> & {
  isPollingEnabled: boolean;
  enablePolling: () => void;
  disablePolling: () => void;
} => {
  const queryClient = useQueryClient();
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);
  const [hasNetworkError, setHasNetworkError] = useState(false);

  // Global relay functionality state - when disabled, stop all operations
  const { isRelayFunctionalityEnabled } = useAppConfig();

  const query = useQuery({
    queryKey: [...GET_RELAY_STATES_QUERYKEY],
    queryFn: RelaysEndpoints.getAllStates,
    enabled: isRelayFunctionalityEnabled, // Respect global functionality state
    retry: 1,
    staleTime: 1000 * 5, // 5 seconds - relay states change frequently
    refetchInterval: isRelayFunctionalityEnabled && isPollingEnabled ? 3000 : false, // Conditional polling
    refetchOnWindowFocus: isRelayFunctionalityEnabled && isPollingEnabled, // Conditional refetch on focus
    refetchOnMount: true, // Always refetch when component mounts
  });

  // Monitor for network errors and disable polling
  useEffect(() => {
    if (query.error) {
      if (isRelayNetworkLikeError(query.error)) {
        setHasNetworkError(true);
        setIsPollingEnabled(false);
      }
    } else if (hasNetworkError && query.isSuccess) {
      // Reset error state when we get a successful response
      setHasNetworkError(false);
    }
  }, [query.error, query.isSuccess, hasNetworkError]);

  const enablePolling = useCallback(() => {
    setIsPollingEnabled(true);
    setHasNetworkError(false);
    // Force a refetch when re-enabling polling
    queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATES_QUERYKEY] });
  }, [queryClient]);

  const disablePolling = useCallback(() => {
    setIsPollingEnabled(false);
  }, []);

  return {
    ...query,
    isPollingEnabled,
    enablePolling,
    disablePolling,
  };
};
