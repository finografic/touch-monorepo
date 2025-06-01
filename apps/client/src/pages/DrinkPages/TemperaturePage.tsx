import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect, useRef, useState } from 'react';
import { TemperatureInput } from 'components/TemperatureInput/TemperatureInput';
import type { Temperature } from 'types/orders.types';
import { OrderFieldKeys } from 'constants/app.config';
import { FilterKeys } from 'constants/filters.constants';

import { useRouteConfig } from 'routes/hooks/useRouteConfig';
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
import { useGetTemperatureProfile } from 'queries/temperature/useGetTemperatureProfile';

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
  const { fieldKey } = useRouteConfig();
  const { filters, setFilter } = useFilters();
  const { setIsNextDisabled } = usePagination();

  const { data: temperatureProfile } = useGetTemperatureProfile(filters);

  // Track both temperatures for validation
  const temperatureRef = useRef({
    initial: INITIAL_TEMP_DEFAULT,
    final: FINAL_TEMP_DEFAULT,
  });

  log('__TEMP__DATA:', 'hotpink', temperatureProfile);

  // Update filters and validate when temperatures change
  const updateTemperatures = (initial: number, final: number) => {
    temperatureRef.current = { initial, final };

    // Update the filter with both temperatures
    setFilter(OrderFieldKeys.temperature, {
      initial,
      final,
      name: `${initial}°C → ${final}°C`, // For display purposes
    });

    // Enable Next button only if final temp is less than initial
    setIsNextDisabled(final >= initial);
  };

  const handleInitialTempChange = (temp: Temperature) => {
    const initial = temp.value;
    const final = temperatureRef.current.final;

    // If initial temp is decreased below final temp, adjust final temp to match initial
    const adjustedFinal = initial <= final ? initial : final;
    updateTemperatures(initial, adjustedFinal);
  };

  const handleFinalTempChange = (temp: Temperature) => {
    const initial = temperatureRef.current.initial;
    const final = temp.value;
    updateTemperatures(initial, final);
  };

  useEffect(
    function updateFinalTemp() {
      // NOTE: reduce so DrinkSubtype.defaultTempConsume takes precedence over DrinkType.defaultTempConsume
      if (!isInitializedRef.current) {
        setTimeout(() => {
          const filtersTempConsumption = Object.values(filters).reduce(
            (acc, value) => value?.defaultTempConsume ?? acc,
            0,
          );

          temperatureRef.current.final = filtersTempConsumption;
          isInitializedRef.current = true;
        }, 150);
      }
    },
    [filters],
  );

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
            value={temperatureRef.current.initial}
            onChange={handleInitialTempChange}
            label="temperatura inicial"
            description="por defecto, la temperatura ambiente suministrada"
            min={INITIAL_TEMP_MIN}
            max={INITIAL_TEMP_MAX}
            step={0.5}
          />
        </Box>
        <Box>
          <TemperatureInput
            value={temperatureRef.current.final}
            onChange={handleFinalTempChange}
            label="temperatura final"
            description="por defecto, la temperatura de consumo recomendada"
            min={FINAL_TEMP_MIN}
            max={Math.min(FINAL_TEMP_MAX, temperatureRef.current.initial)}
            step={0.5}
          />
        </Box>
      </Flex>
    </Flex>
  );
};
