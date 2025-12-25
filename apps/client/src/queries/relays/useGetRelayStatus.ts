import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { RelaysEndpoints, type RelayStatus } from 'api/endpoints';
import { GET_RELAY_STATUS_QUERYKEY } from '.';

/**
 * Get relay connection status
 */
export const useGetRelayStatus = (): UseQueryResult<RelayStatus> => {
  return useQuery({
    queryKey: [...GET_RELAY_STATUS_QUERYKEY],
    queryFn: RelaysEndpoints.getStatus,
    retry: 1,
    staleTime: 1000 * 10, // 10 seconds
  });
};
