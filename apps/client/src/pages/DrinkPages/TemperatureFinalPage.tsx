import { OrderFieldKeys, useOrderSelection } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect } from 'react';
import { TemperatureInput } from 'components/TemperatureInput/TemperatureInput';
import type { Temperature } from 'types/orders.types';
import { useTemperatureSettings } from 'queries/temperature';
import type { DrinkVolume } from 'types/models/volume.model';

// Fallback temperature if no drink type is selected or no default temp is set
const FALLBACK_FINAL_TEMP = 4.5;

export const TemperatureFinalPage = () => {
  const {
    selectedValue: selectedTemperature,
    handleSelection: handleTemperatureSelection,
    hasValidSelection,
    orders,
  } = useOrderSelection<Temperature>({
    field: OrderFieldKeys.finalTemperature,
    // Initialize with the drink type's default consumption temp or fallback
    initialValue: {
      value: FALLBACK_FINAL_TEMP,
      unit: '°C',
    },
  });

  const currentVolume = orders[0]?.volume as DrinkVolume | undefined;

  // Fetch temperature settings when order details are available
  const { data: tempSettings } = useTemperatureSettings({
    drinkTypeId: orders[0]?.drinkType?.id ?? '',
    drinkSubtypeId: orders[0]?.drinkSubtype?.id,
    containerTypeId: orders[0]?.containerType?.id ?? '',
    volumeId: currentVolume?.id ?? '',
  });

  // Update the initial value when temperature settings are loaded
  useEffect(() => {
    if (tempSettings?.defaultConsumptionTemp) {
      handleTemperatureSelection({
        value: tempSettings.defaultConsumptionTemp,
        unit: '°C',
      });
    }
  }, [tempSettings, handleTemperatureSelection]);

  const { setIsNextDisabled } = usePagination();

  useEffect(() => {
    setIsNextDisabled(!hasValidSelection);
  }, [hasValidSelection, setIsNextDisabled]);

  return (
    <TemperatureInput
      value={selectedTemperature}
      onChange={handleTemperatureSelection}
      defaultValue={tempSettings?.defaultConsumptionTemp ?? FALLBACK_FINAL_TEMP}
      description="By default, it indicates the recommended serving temperature for the selected beverage. The user can change it using the + and - buttons. Units are in degrees Celsius with one decimal place."
      min={tempSettings?.minConsumptionTemp ?? -10}
      max={tempSettings?.maxConsumptionTemp ?? 40}
      step={0.5}
    />
  );
};
