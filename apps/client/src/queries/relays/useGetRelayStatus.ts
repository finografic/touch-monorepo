import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';
import { GET_RELAY_STATUS_QUERYKEY } from 'queries/relays';
import { api } from 'api';
import { transformAxiosError } from 'src/api/api.utils';

export interface RelayStatus {
  success: boolean;
  connected: boolean;
  port?: string;
  error?: string;
}

const getRelayStatus = async (): Promise<RelayStatus> => {
  try {
    const response = await api.get<RelayStatus>('/relay/status');
    if (response.status !== 200) {
      throw new Error(`Failed to fetch relay status: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    throw transformAxiosError(error);
  }
};

export const useGetRelayStatus = (): UseQueryResult<RelayStatus, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_RELAY_STATUS_QUERYKEY],
    queryFn: getRelayStatus,
    enabled: true,
    retry: 1,
    staleTime: 1000 * 10, // 10 seconds
    refetchInterval: 5000, // Refetch every 5 seconds
  });
};
