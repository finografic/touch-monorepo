import { OrderFieldKeys, useOrderSelection } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect } from 'react';
import { TemperatureInput } from 'components/TemperatureInput/TemperatureInput';
import type { Temperature } from 'types/orders.types';

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
  } = useOrderSelection<Temperature>({
    field: OrderFieldKeys.initialTemperature,
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
      defaultValue={DEFAULT_INITIAL_TEMP}
      description="By default, it indicates the ambient temperature supplied by a probe. The user can modify it using the + and - buttons. Units are in degrees Celsius with one decimal place."
      min={-10}
      max={40}
      step={0.5}
    />
  );
};
