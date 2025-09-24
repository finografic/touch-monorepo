import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';
import { api } from 'api';
import { GET_RELAY_STATES_QUERYKEY } from 'queries/relays';
import { transformAxiosError } from 'src/api/api.utils';

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

export const useGetRelayStates = (): UseQueryResult<RelayState[], ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_RELAY_STATES_QUERYKEY],
    queryFn: getRelayStates,
    enabled: true,
    retry: 1,
    staleTime: 1000 * 5, // 5 seconds - relay states change frequently
    refetchInterval: 2000, // Refetch every 2 seconds for real-time updates
  });
};
