import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TemperatureInput } from 'components/TemperatureInput/TemperatureInput';
import type { Temperature } from 'types/orders.types';
import { OrderFieldKeys } from 'constants/app.config';
import { useFilters } from 'hooks/useFilters';
import { Box, Flex } from '@radix-ui/themes';
import { styles } from './content.styles';
import {
  FINAL_TEMP_MAX,
  FINAL_TEMP_MIN,
  INITIAL_TEMP_DEFAULT,
  INITIAL_TEMP_MAX,
  INITIAL_TEMP_MIN,
  MIN_TEMP_DIFFERENCE,
} from 'constants/temperature.config';
import { useGetMinMaxTemperatures } from 'queries/temperature/useGetMinMaxTemperatures';

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

export const TemperaturePage = () => {
  const isInitializedRef = useRef(false);
  const { dataFiltered, setFilter } = useFilters();
  const { setIsNextDisabled } = usePagination();

  // Convert from ref to state
  const [temperatures, setTemperatures] = useState({
    initial: INITIAL_TEMP_DEFAULT,
    final: INITIAL_TEMP_DEFAULT,
  });

  // Get min and max temperatures
  const { data: minMaxTemperatures } = useGetMinMaxTemperatures();

  // Calculate duration when temperatures or profile changes
  const defaultTempConsume = useMemo(() => {
    if (!dataFiltered || dataFiltered.length === 0) return;

    return dataFiltered[0].defaultTempConsume;
  }, [dataFiltered]);

  // Get temperature profile data
  // const { data: temperatureProfile } = useGetTemperatureProfile({
  //   id: temperatureProfileId,
  //   enabled: !!temperatureProfileId,
  // });

  // Calculate duration when temperatures or profile changes
  // const duration = useMemo(() => {
  //   if (!temperatureProfile) return 0;

  //   // With a single profile, we can directly calculate the times
  //   const initialTime = getTimeValue(temperatureProfile, elementNumber);
  //   const finalTime = getTimeValue(temperatureProfile, elementNumber);

  //   return Math.abs(finalTime - initialTime);
  // }, [temperatureProfile, elementNumber]);

  // ======================================================================== //

  useEffect(
    function initializeFinalTemp() {
      if (!isInitializedRef.current) {
        setTimeout(() => {
          if (defaultTempConsume) {
            setTemperatures((prev) => ({
              ...prev,
              final: defaultTempConsume,
            }));
            isInitializedRef.current = true;
          }
        }, 150);
      }
    },
    [defaultTempConsume],
  );

  // ======================================================================== //

  /*
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
  */

  // ======================================================================== //

  // Update filters and validate when temperatures change
  const updateTemperatures = (initial: number, final: number) => {
    setTemperatures({ initial, final });

    // Update the filter with both temperatures
    setFilter(OrderFieldKeys.temperature, {
      initial,
      final,
      name: `${initial}°C → ${final}°C`, // For display purposes
    });

    // Enable Next button only if final temp is less than initial by at least MIN_TEMP_DIFFERENCE
    setIsNextDisabled(final >= initial - MIN_TEMP_DIFFERENCE);
  };

  const handleInitialTempChange = (temp: Temperature) => {
    const initial = temp.value;
    const final = temperatures.final;

    // If initial temp is decreased below final temp, adjust final temp
    const adjustedFinal = Math.min(final, initial - MIN_TEMP_DIFFERENCE);
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
              max={temperatures.initial - MIN_TEMP_DIFFERENCE} // Max should be current initial temp
              step={0.5}
            />
          </Box>
        </Flex>
      )}
      {/* {duration > 0 && (
        <Box>
          <p>Estimated duration: {Math.round(duration)} seconds</p>
        </Box>
      )} */}
    </Flex>
  );
};
