import { OrderFieldKeys, useOrderSelection } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect } from 'react';
import { TemperatureInput } from '../../components/TemperatureInput/TemperatureInput';
import type { Temperature } from 'types/orders.types';

const DEFAULT_FINAL_TEMP = 4.5;

const DEFAULT_TEMP: Temperature = {
  value: DEFAULT_FINAL_TEMP,
  unit: '°C',
};

export const TemperatureFinalPage = () => {
  const {
    selectedValue: selectedTemperature,
    handleSelection: handleTemperatureSelection,
    hasValidSelection,
  } = useOrderSelection<Temperature>({
    field: OrderFieldKeys.finalTemperature,
    initialValue: DEFAULT_TEMP,
  });

  const { setIsNextDisabled } = usePagination();

  useEffect(() => {
    setIsNextDisabled(!hasValidSelection);
  }, [hasValidSelection, setIsNextDisabled]);

  return (
    <TemperatureInput
      value={selectedTemperature}
      onChange={handleTemperatureSelection}
      defaultValue={DEFAULT_FINAL_TEMP}
      description="By default, it indicates the recommended serving temperature for the selected beverage. The user can change it using the + and - buttons. Units are in degrees Celsius with one decimal place."
      min={-10}
      max={40}
      step={0.5}
    />
  );
};
