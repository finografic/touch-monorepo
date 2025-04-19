import { OrderFieldKeys, useOrderSelection } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect } from 'react';
import { TemperatureInput } from 'components/TemperatureInput/TemperatureInput';
import type { Temperature, ContainerType } from 'types/orders.types';
import { useCalculateTemperature } from 'queries/temperature';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'routes/routes.config';
import type { DrinkType } from 'types/models/drink-type.model';
import type { DrinkVolume } from 'types/models/volume.model';

const DEFAULT_FINAL_TEMP = 4.5;

const DEFAULT_TEMP: Temperature = {
  value: DEFAULT_FINAL_TEMP,
  unit: '°C',
};

export const TemperatureFinalPage = () => {
  const navigate = useNavigate();
  const { mutate: calculateTemp, isPending } = useCalculateTemperature();

  const {
    selectedValue: selectedTemperature,
    handleSelection: handleTemperatureSelection,
    hasValidSelection,
    orders,
  } = useOrderSelection<Temperature>({
    field: OrderFieldKeys.finalTemperature,
    initialValue: DEFAULT_TEMP,
  });

  const { setIsNextDisabled } = usePagination();

  useEffect(() => {
    setIsNextDisabled(!hasValidSelection);
  }, [hasValidSelection, setIsNextDisabled]);

  const handleStart = () => {
    const currentOrder = orders[0];
    if (
      !currentOrder?.drinkType ||
      !currentOrder?.volume ||
      !currentOrder?.containerType ||
      !currentOrder?.initialTemperature ||
      !currentOrder?.finalTemperature
    ) {
      console.error('Missing required selections');
      return;
    }

    const volume = currentOrder.volume as unknown as DrinkVolume;

    calculateTemp(
      {
        drinkTypeId: currentOrder.drinkType.id,
        drinkSubtypeId: currentOrder.drinkSubtype?.id,
        containerTypeId: currentOrder.containerType.id,
        volumeId: volume.id,
        initialTemp: currentOrder.initialTemperature.value,
        targetTemp: currentOrder.finalTemperature.value,
      },
      {
        onSuccess: (data) => {
          // Store the calculation results in local storage or state management
          localStorage.setItem('temperatureCalculation', JSON.stringify(data));
          // Navigate to the timer/countdown page
          navigate(ROUTES.INITIAL_TEMPERATURE);
        },
        onError: (error) => {
          console.error('Failed to calculate temperature:', error);
          // TODO: Show error message to user
        },
      },
    );
  };

  return (
    <>
      <TemperatureInput
        value={selectedTemperature}
        onChange={handleTemperatureSelection}
        defaultValue={DEFAULT_FINAL_TEMP}
        description="By default, it indicates the recommended serving temperature for the selected beverage. The user can change it using the + and - buttons. Units are in degrees Celsius with one decimal place."
        min={-10}
        max={40}
        step={0.5}
      />
      <div className="button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          « Back
        </button>
        <button className="start-button" onClick={handleStart} disabled={!hasValidSelection || isPending}>
          {isPending ? 'Calculating...' : 'START'}
        </button>
      </div>
    </>
  );
};
