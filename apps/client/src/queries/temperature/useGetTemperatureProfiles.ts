import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

import { GET_TEMPERATURE_PROFILES_QUERYKEY } from 'queries/temperature';
import type { TemperatureProfile } from 'types/temperature.types';

interface UseGetTemperatureProfilesParams {
  initial: number;
  final: number;
  enabled: boolean;
  orderId: string;
}

interface UseGetTemperatureProfilesReturn {
  data: TemperatureProfile[] | undefined;
  isFetching: boolean;
  isError: boolean;
  isLoading: boolean;
  error: Error | null;
}

export const useGetTemperatureProfiles = ({
  initial,
  final,
  enabled,
  orderId,
}: UseGetTemperatureProfilesParams): UseGetTemperatureProfilesReturn => {
  const { data, isFetching, isError, isLoading, error } = useQuery({
    queryKey: [...GET_TEMPERATURE_PROFILES_QUERYKEY, initial, final, orderId],
    queryFn: async (): Promise<TemperatureProfile[]> => {
      // For now, return empty array since we're moving to orders_readable
      // This maintains the interface while we transition
      return [];
    },
    enabled: enabled && Boolean(orderId),
  });

  return {
    data,
    isFetching,
    isError,
    isLoading,
    error: error as Error | null,
  };
};
