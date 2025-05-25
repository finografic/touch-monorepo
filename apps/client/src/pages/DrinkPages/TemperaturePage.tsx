import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useRef } from 'react';
import { TemperatureInput } from 'components/TemperatureInput/TemperatureInput';
import type { Temperature } from 'types/orders.types';
import { OrderFieldKeys } from 'constants/app.config';

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

const DEFAULT_TEMP: Temperature = {
  value: INITIAL_TEMP_DEFAULT,
  unit: '°C',
};

export const TemperaturePage = () => {
  const { fieldKey } = useRouteConfig();
  const { setFilter } = useFilters();
  const { setIsNextDisabled } = usePagination();

  // Track both temperatures for validation
  const temperatureRef = useRef({
    initial: INITIAL_TEMP_DEFAULT,
    final: FINAL_TEMP_DEFAULT,
  });

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

    // Ensure final temp doesn't exceed initial
    const adjustedFinal = Math.min(final, initial);
    updateTemperatures(initial, adjustedFinal);
  };

  const handleFinalTempChange = (temp: Temperature) => {
    const initial = temperatureRef.current.initial;
    const final = temp.value;
    updateTemperatures(initial, final);
  };

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
            defaultValue={INITIAL_TEMP_DEFAULT}
            label="initial temperature"
            min={INITIAL_TEMP_MIN}
            max={INITIAL_TEMP_MAX}
            step={0.5}
          />
        </Box>
        <Box>
          <TemperatureInput
            value={temperatureRef.current.final}
            onChange={handleFinalTempChange}
            defaultValue={FINAL_TEMP_DEFAULT}
            label="final temperature"
            min={FINAL_TEMP_MIN}
            max={Math.min(FINAL_TEMP_MAX, temperatureRef.current.initial)}
            step={0.5}
          />
        </Box>
      </Flex>
    </Flex>
  );
};
