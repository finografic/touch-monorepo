import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TemperatureInput } from 'components/TemperatureInput/TemperatureInput';
import type { Temperature } from 'types/orders.types';
import { OrderFieldKeys } from 'constants/app.config';
import { useFilters } from 'hooks/useFilters';
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
import {
  type TemperatureProfile,
  useGetTemperatureProfile,
} from 'queries/temperature/useGetTemperatureProfile';
import { reduceFilterProperty } from 'utils/filters.utils';
import { findClosestTemperature, getTimeValue } from 'utils/temperature.utils';
import { FilterKeys } from 'constants/filters.constants';
import { useGetMinMaxTemperatures } from 'queries/temperature/useGetMinMaxTemperatures';
import { useOrders } from 'providers/OrdersProvider';

// ======================================================================== //
// NOTE:  HOW TEMPERATURE WORKS:

/*
INITIAL:
def: 25
min 0
max 40 (temp db)

FINAL:
def: (consume db)
min: (freeze db)
max: INITIAL TEMPERATURE VALUE
*/

// ======================================================================== //

const DEFAULT_TEMP: Temperature = {
  value: INITIAL_TEMP_DEFAULT,
  unit: '°C',
};

export const TemperaturePage = () => {
  const isInitializedRef = useRef(false);
  const { orders } = useOrders();
  const { filters, setFilter } = useFilters();
  const { setIsNextDisabled } = usePagination();

  // Convert from ref to state
  const [temperatures, setTemperatures] = useState({
    initial: INITIAL_TEMP_DEFAULT,
    final: INITIAL_TEMP_DEFAULT,
  });

  // Get element number from filters (defaulting to 1 for now)
  const elementNumber =
    Number(
      reduceFilterProperty<{ elementNumber: number }>({
        propKey: 'elementNumber' as const,
        filters,
      }),
    ) || 1;

  // Get min and max temperatures
  const { data: minMaxTemperatures } = useGetMinMaxTemperatures();

  const temperatureProfileId = reduceFilterProperty<{ temperatureProfileId: string }>({
    propKey: 'temperatureProfileId' as const,
    filters,
  });

  // Get temperature profile data
  const { data: temperatureProfile } = useGetTemperatureProfile({
    id: temperatureProfileId,
    enabled: !!temperatureProfileId,
  });

  // log('__TEMP__temperatureProfileId:', 'lime', typeof temperatureProfileId, temperatureProfileId);
  log('__PROFILE: temperatureProfile', 'lime', { temperatureProfileId, temperatureProfile });

  // Get consumption and freeze temperatures from filters
  const defaultTempConsume =
    Number(
      reduceFilterProperty<{ defaultTempConsume: number }>({
        propKey: 'defaultTempConsume' as const,
        filters,
      }),
    ) || FINAL_TEMP_DEFAULT;

  // ======================================================================== //
  // TODO:  REMOVE (TEMPORARILY??) -- depending, if needed

  /*
  const defaultTempFreeze =
    Number(
      reduceFilterProperty<{ defaultTempFreeze: number }>({
        propKey: 'defaultTempFreeze' as const,
        filters,
      }),
    ) || undefined;
     */

  // ======================================================================== //

  // Calculate duration when temperatures or profile changes
  const duration = useMemo(() => {
    if (!temperatureProfile) return 0;

    // With a single profile, we can directly calculate the times
    const initialTime = getTimeValue(temperatureProfile, elementNumber);
    const finalTime = getTimeValue(temperatureProfile, elementNumber);

    return Math.abs(finalTime - initialTime);
  }, [temperatureProfile, elementNumber]);

  // Initialize final temperature from filters when component mounts
  useEffect(
    function initializeFinalTemp() {
      if (!isInitializedRef.current) {
        setTimeout(() => {
          const filtersTempConsumption =
            Number(
              reduceFilterProperty<{ defaultTempConsume: string }>({
                propKey: 'defaultTempConsume' as const,
                filters,
              }),
            ) || FINAL_TEMP_DEFAULT;

          log('filtersTempConsumption:', 'lime', typeof filtersTempConsumption, filtersTempConsumption);

          if (filtersTempConsumption) {
            setTemperatures((prev) => ({
              ...prev,
              final: filtersTempConsumption,
            }));
            isInitializedRef.current = true;
          }
        }, 150);
      }
    },
    [filters],
  );

  // Update filters and validate when temperatures change
  const updateTemperatures = (initial: number, final: number) => {
    setTemperatures({ initial, final });

    // Update the filter with both temperatures
    setFilter(OrderFieldKeys.temperature, {
      initial,
      final,
      name: `${initial}°C → ${final}°C`, // For display purposes
      duration, // Add calculated duration to the filter
    });

    // Enable Next button only if final temp is less than initial
    setIsNextDisabled(final >= initial);
  };

  const handleInitialTempChange = (temp: Temperature) => {
    const initial = temp.value;
    const final = temperatures.final;

    // If initial temp is decreased below final temp, adjust final temp to match initial
    const adjustedFinal = initial <= final ? initial : final;
    updateTemperatures(initial, adjustedFinal);
  };

  const handleFinalTempChange = (temp: Temperature) => {
    const initial = temperatures.initial;
    const final = temp.value;
    updateTemperatures(initial, final);
  };

  log('__DEV: isInitializedRef.current', 'grey', typeof isInitializedRef.current, isInitializedRef.current);
  log('__DEV: temperatures.final:', 'yellow', temperatures.final);

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
      {isInitializedRef.current && (
        <Flex gap="3" justify="center">
          <Box>
            <TemperatureInput
              value={temperatures.initial}
              onChange={handleInitialTempChange}
              label="temperatura inicial"
              description="por defecto, la temperatura ambiente suministrada"
              // min={INITIAL_TEMP_MIN}
              // max={INITIAL_TEMP_MAX}
              min={minMaxTemperatures?.min ?? INITIAL_TEMP_MIN}
              max={minMaxTemperatures?.max ?? INITIAL_TEMP_MAX}
              step={0.5}
            />
          </Box>
          <Box>
            <TemperatureInput
              value={temperatures.final}
              onChange={handleFinalTempChange}
              label="temperatura final"
              description="por defecto, la temperatura de consumo recomendada"
              // min={defaultTempFreeze ?? -Infinity} // Use freeze temp as min if available
              min={minMaxTemperatures?.min ?? FINAL_TEMP_MIN}
              max={temperatures.initial ?? FINAL_TEMP_MAX} // Max should be current initial temp
              step={0.5}
            />
          </Box>
        </Flex>
      )}
      {duration > 0 && (
        <Box>
          <p>Estimated duration: {Math.round(duration)} seconds</p>
        </Box>
      )}
    </Flex>
  );
};
