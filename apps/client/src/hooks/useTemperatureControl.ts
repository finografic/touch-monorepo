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

  const temperatureProfileId = reduceFilterProperty<{ temperatureProfileId: string }>({
    propKey: 'temperatureProfileId' as const,
    filters,
  });

  // Get temperature profile data - only enabled when we have a valid temperature filter and profile ID
  const { data: temperatureProfile } = useGetTemperatureProfile({
    id: temperatureProfileId,
    enabled: Boolean(temperatureProfileId && filters[OrderFieldKeys.temperature]),
  });

  const startTemperatureControl = async () => {
    if (!temperatureProfile?.length) return;

    setIsCalculating(true);
    try {
      const currentFilter = filters[OrderFieldKeys.temperature] as TemperatureFilter;
      const { initial, final } = currentFilter;

      // Find the closest temperature profiles
      const initialTempRow = findClosestTemperature(temperatureProfile, initial);
      const finalTempRow = findClosestTemperature(temperatureProfile, final);

      // Get time values based on element number
      const initialTime = getTimeValue(initialTempRow, elementNumber);
      const finalTime = getTimeValue(finalTempRow, elementNumber);

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
  };
};
