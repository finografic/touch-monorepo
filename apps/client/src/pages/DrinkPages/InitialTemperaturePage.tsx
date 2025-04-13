import { useOrderSelection, OrderFieldKeys } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect } from 'react';
import { TemperatureInput } from '../../components/TemperatureInput/TemperatureInput';
import type { Temperature } from 'types/orders.types';

export const InitialTemperaturePage = () => {
  const {
    selectedValue: selectedTemperature,
    handleSelection: handleTemperatureSelection,
    hasValidSelection,
  } = useOrderSelection<Temperature>({
    field: OrderFieldKeys.initialTemperature,
  });

  const { setIsNextDisabled } = usePagination();

  useEffect(() => {
    setIsNextDisabled(!hasValidSelection);
  }, [hasValidSelection, setIsNextDisabled]);

  return (
    <TemperatureInput
      value={selectedTemperature}
      onChange={handleTemperatureSelection}
      defaultValue={23.5}
      description="By default, it indicates the ambient temperature supplied by a probe. The user can modify it using the + and - buttons. Units are in degrees Celsius with one decimal place."
      min={-10}
      max={40}
      step={0.5}
    />
  );
};
