import { OrderFieldKeys, useOrderSelection } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect } from 'react';
import { TemperatureInput } from 'components/TemperatureInput/TemperatureInput';
import type { Temperature } from 'types/orders.types';
import { useTemperatureSettings } from 'queries/temperature';
import type { DrinkVolume } from 'types/models/volume.model';

const DEFAULT_INITIAL_TEMP = 23.5;

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
  const { data: tempSettings } = useTemperatureSettings({
    drinkTypeId: orders[0]?.drinkType?.id ?? '',
    drinkSubtypeId: orders[0]?.drinkSubtype?.id,
    containerTypeId: orders[0]?.containerType?.id ?? '',
    volumeId: currentVolume?.id ?? '',
  });

  const { setIsNextDisabled } = usePagination();

  useEffect(() => {
    setIsNextDisabled(!hasValidSelection);
  }, [hasValidSelection, setIsNextDisabled]);

  return (
    <TemperatureInput
      value={selectedTemperature}
      onChange={handleTemperatureSelection}
      defaultValue={DEFAULT_INITIAL_TEMP}
      description="By default, it indicates the ambient temperature supplied by a probe. The user can modify it using the + and - buttons. Units are in degrees Celsius with one decimal place."
      min={tempSettings?.defaultFreezeTemp ?? -10}
      max={tempSettings?.maxConsumptionTemp ?? 40}
      step={0.5}
    />
  );
};
