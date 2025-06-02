import { useState } from 'react';
import { useFilters } from './useFilters';
import { OrderFieldKeys } from 'constants/app.config';
import { useGetTemperatureProfile } from 'queries/temperature/useGetTemperatureProfile';
import { findClosestTemperature, getTimeValue } from 'utils/temperature.utils';
import type { TemperatureFilter } from 'types/orders.types';
import { reduceFilterProperty } from 'utils/filters.utils';

interface UseTemperatureControlOptions {
  onSuccess?: (duration: number) => void;
  onError?: (error: Error) => void;
}

export const useTemperatureControl = (options: UseTemperatureControlOptions = {}) => {
  const [isCalculating, setIsCalculating] = useState(false);
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

  // Get temperature profile data for initial temperature
  const initialTempProfileQuery = useGetTemperatureProfile({
    temperature: initial,
    enabled: Boolean(initial && currentFilter),
  });

  // Get temperature profile data for final temperature
  const finalTempProfileQuery = useGetTemperatureProfile({
    temperature: final,
    enabled: Boolean(final && currentFilter),
  });

  const startTemperatureControl = async () => {
    if (!initialTempProfileQuery.data || !finalTempProfileQuery.data || !currentFilter) {
      console.error('Missing temperature profiles or filter data');
      return;
    }

    setIsCalculating(true);
    try {
      // Get time values based on element number
      const initialTime = getTimeValue(initialTempProfileQuery.data, elementNumber);
      const finalTime = getTimeValue(finalTempProfileQuery.data, elementNumber);

      // Calculate total duration
      const totalDuration = Math.abs(finalTime - initialTime);

      // Update filter with calculated duration
      setFilter(OrderFieldKeys.temperature, {
        ...currentFilter,
        duration: totalDuration,
        status: 'in_progress',
      });

      // TODO: Start countdown timer
      // TODO: Send command to hardware

      // For now, just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      options.onSuccess?.(totalDuration);
    } catch (error) {
      console.error('Error starting temperature control:', error);
      options.onError?.(error as Error);
    } finally {
      setIsCalculating(false);
    }
  };

  return {
    isCalculating,
    startTemperatureControl,
    isReady: Boolean(initialTempProfileQuery.data && finalTempProfileQuery.data),
  };
};
