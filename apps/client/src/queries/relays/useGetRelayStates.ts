import { useCallback, useEffect, useState } from 'react';
import type { ErrorResponse } from '@workspace/core/api';
import { transformAxiosError } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import { GET_RELAY_STATES_QUERYKEY } from 'queries/relays';

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
    const response = await api.get<RelayStatesResponse>('/relay/states');
    if (response.status !== 200) {
      throw new Error(`Failed to fetch relay states: ${response.statusText}`);
    }
    return response.data.states;
  } catch (error) {
    throw transformAxiosError(error);
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

  const query = useQuery({
    queryKey: [...GET_RELAY_STATES_QUERYKEY],
    queryFn: getRelayStates,
    enabled: true,
    retry: 1,
    staleTime: 1000 * 5, // 5 seconds - relay states change frequently
    refetchInterval: isPollingEnabled ? 3000 : false, // Conditional polling
    refetchOnWindowFocus: isPollingEnabled, // Conditional refetch on focus
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
