import { useCallback, useEffect, useState } from 'react';
import type { ErrorResponse } from '@workspace/core/api';
import { transformFetchError } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import { GET_RELAY_STATES_QUERYKEY } from 'queries/relays';
import { useAppConfig } from 'providers/AppConfigProvider';

export interface RelayState {
  slotNumber: number;
  isOn: boolean;
  lastUpdated: string;
}

export interface RelayStatesResponse {
  success: boolean;
  states: RelayState[];
  count: number;
}

const getRelayStates = async (): Promise<RelayState[]> => {
  try {
    // Fetch client returns data directly
    const data = await api.get<RelayStatesResponse>('/relay/states');
    return data.states;
  } catch (error) {
    throw transformFetchError(error);
  }
};

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
    queryFn: getRelayStates,
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
      const error = query.error as ErrorResponse;
      // Check if it's a network error (server down, connection refused, etc.)
      if (
        error.message?.includes('Network Error') ||
        error.message?.includes('RPC Request Failed') ||
        error.message?.includes('ECONNREFUSED') ||
        error.message?.includes('fetch')
      ) {
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
