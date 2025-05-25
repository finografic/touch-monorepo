import { useOrderSelection } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect, useRef } from 'react';
import { TemperatureInput } from 'components/TemperatureInput/TemperatureInput';
import type { Temperature } from 'types/orders.types';
import { useGetTemperatureSettings } from 'queries/temperature';
import type { DrinkVolume } from 'types/models/volume.model';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { Loader } from '../../components/Loader/Loader';
import { OrderFieldKeys } from 'constants/app.config';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useOrders } from 'providers/OrdersProvider';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { Box, Flex } from '@radix-ui/themes';
import { styles } from './content.styles';
import {
  FINAL_TEMP_DEFAULT,
  FINAL_TEMP_MAX,
  FINAL_TEMP_MIN,
  INITIAL_TEMP_DEFAULT,
  INITIAL_TEMP_MAX,
  INITIAL_TEMP_MIN,
} from 'constants/temperature.config';

// ======================================================================== //
// NOTE:  HOW TEMPERATURE WORKS:
/*
Initial
def: 25
min 0
max 40 (temp db)

Final
def: (consumo db)
min: (cong db)
max: INITIAL TEMPERATURE VALUE
*/

// ======================================================================== //

// const INITIAL_TEMP_DEFAULT = 25;
// const INITIAL_TEMP_MIN = 10;
// const INITIAL_TEMP_MAX = 40;

// const FINAL_TEMP_DEFAULT = 25;
// const FINAL_TEMP_MIN = 10;
// const FINAL_TEMP_MAX = 40;

const DEFAULT_TEMP: Temperature = {
  value: INITIAL_TEMP_DEFAULT,
  unit: '°C',
};

export const TemperaturePage = () => {
  const { fieldKey, padsConfig } = useRouteConfig();
  const { pads } = useLayoutUi();
  const { orders, setOrdersFilter } = useOrders();
  /*

  const { setIsNextDisabled } = usePagination();
  const prevStateRef = useRef({ isLoading: tempSettingsQuery.isLoading, hasValidSelection });

  useEffect(() => {
    const { isLoading: wasLoading, hasValidSelection: hadValidSelection } = prevStateRef.current;

    // Only update if the state actually changed
    if (wasLoading !== tempSettingsQuery.isLoading || hadValidSelection !== hasValidSelection) {
      prevStateRef.current = { isLoading: tempSettingsQuery.isLoading, hasValidSelection };

      // Schedule the state update for the next tick
      queueMicrotask(() => {
        setIsNextDisabled(tempSettingsQuery.isLoading || !hasValidSelection);
      });
    }
  }, [hasValidSelection, setIsNextDisabled, tempSettingsQuery.isLoading]);

  // // Ensure initial temperature is within bounds when settings load
  useEffect(() => {
    if (tempSettingsQuery.data && selectedTemperature) {
      const minTemp = tempSettingsQuery.data.defaultTempFreeze ?? DEFAULT_MIN_TEMP;
      const maxTemp = tempSettingsQuery.data.maxTempConsume ?? DEFAULT_MAX_TEMP;

      if (selectedTemperature.value < minTemp || selectedTemperature.value > maxTemp) {
        // Bound the temperature within the allowed range
        const boundedTemp = Math.min(Math.max(selectedTemperature.value, minTemp), maxTemp);
        handleTemperatureSelection({
          value: boundedTemp,
          unit: '°C',
        });
      }
    }
  }, [tempSettingsQuery.data, selectedTemperature, handleTemperatureSelection]);
  */

  // if (tempSettingsQuery.isLoading) {
  //   return <div>Loading temperature settings...</div>;
  // }

  /*
  if (tempSettingsQuery.status === 'pending') {
    return <Loader message="Loading drink subtypes..." />;
  }

  if (tempSettingsQuery.error) {
    return <ErrorMessage error={tempSettingsQuery.error} />;
  }
    */

  // log('__DEV: tempSettingsQuery', 'magenta', {
  //   status: tempSettingsQuery.status,
  //   data: tempSettingsQuery.data,
  //   error: tempSettingsQuery.error,
  //   isLoading: tempSettingsQuery.isLoading,
  //   isFetching: tempSettingsQuery.isFetching,
  //   isPending: tempSettingsQuery.isPending,
  // });

  // ======================================================================== //

  const handleChange = (temp: Temperature) => {
    console.log('temp', temp);
  };

  // return <pre>{JSON.stringify(orders, null, 2)}</pre>;

  return (
    <Flex css={styles} className="temperature-content" gap="3" direction="column">
      <Flex className="page-description" gap="3" justify="center">
        <Box>
          <p>
            By default, it indicates the ambient temperature supplied by a probe. The user can modify it using
            the + and - buttons. Units are in degrees Celsius with one decimal place.
          </p>
        </Box>
      </Flex>
      <Flex gap="3" justify="center">
        <Box>
          <TemperatureInput
            value={25}
            onChange={handleChange}
            defaultValue={INITIAL_TEMP_DEFAULT}
            label="initial temperature"
            min={0}
            max={40}
            step={0.5}
          />
        </Box>
        <Box>
          <TemperatureInput
            value={25}
            onChange={handleChange}
            defaultValue={FINAL_TEMP_DEFAULT}
            label="final temperature"
            min={FINAL_TEMP_MIN}
            max={FINAL_TEMP_MAX}
            step={0.5}
          />
        </Box>
      </Flex>
    </Flex>
  );

  // return (
  //   <TemperatureInput
  //     value={selectedTemperature}
  //     onChange={handleTemperatureSelection}
  //     defaultValue={DEFAULT_INITIAL_TEMP}
  //     description="By default, it indicates the ambient temperature supplied by a probe. The user can modify it using the + and - buttons. Units are in degrees Celsius with one decimal place."
  //     min={tempSettingsQuery.data?.defaultTempFreeze ?? DEFAULT_MIN_TEMP}
  //     max={tempSettingsQuery.data?.maxTempConsume ?? DEFAULT_MAX_TEMP}
  //     step={0.5}
  //   />
  // );
};
