import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { RelaysEndpoints } from 'api/endpoints';

import { GET_RELAY_STATE_QUERYKEY } from '.';

/**
 * Get state of a single relay by slot number
 */
export const useGetRelayState = (slotNumber: number): UseQueryResult<boolean> => {
  return useQuery({
    queryKey: [...GET_RELAY_STATE_QUERYKEY, slotNumber],
    queryFn: () => RelaysEndpoints.getState(slotNumber),
    enabled: true,
    retry: 1,
    staleTime: 1000 * 5, // 5 seconds
  });
};
