import { OrderFieldKeys, useOrderSelection } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect, useRef } from 'react';
import { TemperatureInput } from 'components/TemperatureInput/TemperatureInput';
import type { Temperature } from 'types/orders.types';
import { useTemperatureSettings } from 'queries/temperature';
import type { DrinkVolume } from 'types/models/volume.model';

const DEFAULT_INITIAL_TEMP = 23.5;
// Safe default limits that match most drink types
const DEFAULT_MIN_TEMP = 2;
const DEFAULT_MAX_TEMP = 40;

const DEFAULT_TEMP: Temperature = {
  value: DEFAULT_INITIAL_TEMP,
  unit: '°C',
};

export const TemperatureInitialPage = () => {
  const {
    selectedValue: selectedTemperature,
    handleSelection: handleTemperatureSelection,
    hasValidSelection,
    orders,
  } = useOrderSelection<Temperature>({
    field: OrderFieldKeys.initialTemperature,
    initialValue: DEFAULT_TEMP,
  });

  const currentVolume = orders[0]?.volume as DrinkVolume | undefined;

  // Fetch temperature settings when order details are available
  const { data: tempSettings, isLoading } = useTemperatureSettings({
    drinkTypeId: orders[0]?.drinkType?.id ?? '',
    drinkSubtypeId: orders[0]?.drinkSubtype?.id,
    containerTypeId: orders[0]?.containerType?.id ?? '',
    volumeId: currentVolume?.id ?? '',
  });

  const { setIsNextDisabled } = usePagination();
  const prevStateRef = useRef({ isLoading, hasValidSelection });

  useEffect(() => {
    const { isLoading: wasLoading, hasValidSelection: hadValidSelection } = prevStateRef.current;

    // Only update if the state actually changed
    if (wasLoading !== isLoading || hadValidSelection !== hasValidSelection) {
      prevStateRef.current = { isLoading, hasValidSelection };

      // Schedule the state update for the next tick
      queueMicrotask(() => {
        setIsNextDisabled(isLoading || !hasValidSelection);
      });
    }
  }, [hasValidSelection, setIsNextDisabled, isLoading]);

  // Ensure initial temperature is within bounds when settings load
  useEffect(() => {
    if (tempSettings && selectedTemperature) {
      const minTemp = tempSettings.defaultFreezeTemp ?? DEFAULT_MIN_TEMP;
      const maxTemp = tempSettings.maxConsumptionTemp ?? DEFAULT_MAX_TEMP;

      if (selectedTemperature.value < minTemp || selectedTemperature.value > maxTemp) {
        // Bound the temperature within the allowed range
        const boundedTemp = Math.min(Math.max(selectedTemperature.value, minTemp), maxTemp);
        handleTemperatureSelection({
          value: boundedTemp,
          unit: '°C',
        });
      }
    }
  }, [tempSettings, selectedTemperature, handleTemperatureSelection]);

  if (isLoading) {
    return <div>Loading temperature settings...</div>;
  }

  return (
    <TemperatureInput
      value={selectedTemperature}
      onChange={handleTemperatureSelection}
      defaultValue={DEFAULT_INITIAL_TEMP}
      description="By default, it indicates the ambient temperature supplied by a probe. The user can modify it using the + and - buttons. Units are in degrees Celsius with one decimal place."
      min={tempSettings?.defaultFreezeTemp ?? DEFAULT_MIN_TEMP}
      max={tempSettings?.maxConsumptionTemp ?? DEFAULT_MAX_TEMP}
      step={0.5}
    />
  );
};
