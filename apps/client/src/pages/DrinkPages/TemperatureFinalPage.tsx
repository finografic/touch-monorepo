import { OrderFieldKeys, useOrderSelection } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect } from 'react';
import { TemperatureInput } from 'components/TemperatureInput/TemperatureInput';
import type { Temperature } from 'types/orders.types';
import { useGetTemperatureSettings } from 'queries/temperature';
import type { DrinkVolume } from 'types/models/volume.model';

// Fallback temperature if no drink type is selected or no default temp is set
const FALLBACK_FINAL_TEMP = 4.5;
// Safe default limits that match most drink types
const DEFAULT_MIN_TEMP = 2;
const DEFAULT_MAX_TEMP = 6;

export const TemperatureFinalPage = () => {
  // const {
  //   selectedValue: selectedTemperature,
  //   handleSelection: handleTemperatureSelection,
  //   hasValidSelection,
  //   orders,
  // } = useOrderSelection<Temperature>({
  //   field: OrderFieldKeys.finalTemperature,
  //   // Initialize with the drink type's default consumption temp or fallback
  //   initialValue: {
  //     value: FALLBACK_FINAL_TEMP,
  //     unit: '°C',
  //   },
  // });

  // const currentVolume = orders[0]?.volume as DrinkVolume | undefined;

  // // Fetch temperature settings when order details are available
  // const { data: tempSettings, isLoading } = useGetTemperatureSettings({
  //   drinkTypeId: orders[0]?.drinkType?.id ?? '',
  //   drinkSubtypeId: orders[0]?.drinkSubtype?.id,
  //   containerTypeId: orders[0]?.containerType?.id ?? '',
  //   volumeId: currentVolume?.id ?? '',
  // });

  // // Update the initial value when temperature settings are loaded
  // useEffect(() => {
  //   if (tempSettings?.defaultConsumptionTemp) {
  //     // Ensure the initial value is within bounds
  //     const boundedTemp = Math.min(
  //       Math.max(tempSettings.defaultConsumptionTemp, tempSettings.minConsumptionTemp ?? DEFAULT_MIN_TEMP),
  //       tempSettings.maxConsumptionTemp ?? DEFAULT_MAX_TEMP,
  //     );

  //     handleTemperatureSelection({
  //       value: boundedTemp,
  //       unit: '°C',
  //     });
  //   }
  // }, [tempSettings, handleTemperatureSelection]);

  // const { setIsNextDisabled } = usePagination();

  // useEffect(() => {
  //   // Disable next button if loading or no valid selection
  //   setIsNextDisabled(isLoading || !hasValidSelection);
  // }, [hasValidSelection, setIsNextDisabled, isLoading]);

  return <div>IS_LOADING: {String()}</div>;

  // if (isLoading) {
  //   return <div>Loading temperature settings...</div>;
  // }

  // return (
  //   <TemperatureInput
  //     value={selectedTemperature}
  //     onChange={handleTemperatureSelection}
  //     defaultValue={tempSettings?.defaultConsumptionTemp ?? FALLBACK_FINAL_TEMP}
  //     description="By default, it indicates the recommended serving temperature for the selected beverage. The user can change it using the + and - buttons. Units are in degrees Celsius with one decimal place."
  //     min={tempSettings?.minConsumptionTemp ?? DEFAULT_MIN_TEMP}
  //     max={tempSettings?.maxConsumptionTemp ?? DEFAULT_MAX_TEMP}
  //     step={0.5}
  //   />
  // );
};
