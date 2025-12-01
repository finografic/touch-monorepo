import type { ErrorResponse } from '@workspace/core/api';
import { transformFetchError } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

import { GET_RELAY_STATE_QUERYKEY } from 'queries/relays';

export interface RelayStateResponse {
  success: boolean;
  slotNumber: number;
  state: boolean;
  message: string;
}

const getRelayState = async (slotNumber: number): Promise<boolean> => {
  try {
    // Fetch client returns data directly
    const data = await api.get<RelayStateResponse>(`/relay/state/${slotNumber}`);
    return data.state;
  } catch (error) {
    throw transformFetchError(error);
  }
};

export const useGetRelayState = (slotNumber: number): UseQueryResult<boolean, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_RELAY_STATE_QUERYKEY, slotNumber],
    queryFn: () => getRelayState(slotNumber),
    enabled: true,
    retry: 1,
    staleTime: 1000 * 5, // 5 seconds
  });
};
