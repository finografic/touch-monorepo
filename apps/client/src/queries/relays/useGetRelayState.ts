import type { ErrorResponse } from '@workspace/core/api';
import { transformAxiosError } from '@workspace/core/api';

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
    const response = await api.get<RelayStateResponse>(`/relay/state/${slotNumber}`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch relay state: ${response.statusText}`);
    }
    return response.data.state;
  } catch (error) {
    throw transformAxiosError(error);
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
