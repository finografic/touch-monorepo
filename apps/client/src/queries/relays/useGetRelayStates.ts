import type { ErrorResponse } from '@workspace/core/api';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RelaysEndpoints, type RelayState } from 'api/endpoints';

import { useAppConfig } from 'providers/AppConfigProvider';
import { GET_RELAY_STATES_QUERYKEY } from 'queries/relays';

/**
 * Fetches all relay states once on mount and whenever mutations invalidate
 * the query key. No background polling — connection status is handled by
 * the relay.store.ts interval instead.
 */
export const useGetRelayStates = (): UseQueryResult<RelayState[], ErrorResponse> & {
  refetchStates: () => void;
} => {
  const queryClient = useQueryClient();
  const { isRelayFunctionalityEnabled } = useAppConfig();

  const query = useQuery({
    queryKey: [...GET_RELAY_STATES_QUERYKEY],
    queryFn: RelaysEndpoints.getAllStates,
    enabled: isRelayFunctionalityEnabled,
    retry: 1,
    staleTime: 1000 * 60,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const refetchStates = () => {
    queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATES_QUERYKEY] });
  };

  return { ...query, refetchStates };
};
