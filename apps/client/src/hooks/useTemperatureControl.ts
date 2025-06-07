import { useFilters } from './useFilters';
import { OrderFieldKeys } from 'constants/app.config';
import { useGetTemperatureProfiles } from 'queries/temperature/useGetTemperatureProfiles';
import { getTimeValue } from 'utils/temperature.utils';
import type { TemperatureFilter } from 'types/temperature.types';
import { reduceFilterProperty } from 'utils/filters.utils';

interface UseTemperatureControlOptions {
  onSuccess?: (duration: number) => void;
  onError?: (error: Error) => void;
}

export const useTemperatureControl = (options: UseTemperatureControlOptions = {}) => {
  // log('__DEV: options', 'orange', options);
  const { filters, setFilter } = useFilters();

  // Get element number from filters (defaulting to 1 for now)
  const elementNumber =
    Number(
      reduceFilterProperty<{ elementNumber: number }>({
        propKey: 'elementNumber' as const,
        filters,
      }),
    ) || 1;

  // Get current temperature filter values
  const currentFilter = filters[OrderFieldKeys.temperature] as TemperatureFilter | undefined;
  const { initial, final } = currentFilter || {};

  // log('__DEV: CURRENT', 'orange', { currentFilter, initial, final });

  // Get both temperature profiles in one query
  const temperatureProfilesQuery = useGetTemperatureProfiles({
    initial,
    final,
    enabled: Boolean(initial && final && currentFilter),
  });

  const startTemperatureControl = async () => {
    if (!temperatureProfilesQuery.data || !currentFilter) {
      console.error('Missing temperature profiles or filter data');
      return;
    }

    try {
      // Get time values based on element number
      const [initialProfile, finalProfile] = temperatureProfilesQuery.data;
      const initialTime = getTimeValue(initialProfile, elementNumber);
      const finalTime = getTimeValue(finalProfile, elementNumber);

      // Calculate total duration
      const totalDuration = Math.abs(finalTime - initialTime);

      // Update filter with calculated duration
      setFilter(OrderFieldKeys.temperature, {
        ...currentFilter,
        duration: totalDuration,
        status: 'in_progress',
      });

      options.onSuccess?.(totalDuration);
    } catch (error) {
      console.error('Error starting temperature control:', error);
      options.onError?.(error as Error);
    }
  };

  return {
    startTemperatureControl,
    temperatureProfilesQuery,
  };
};
