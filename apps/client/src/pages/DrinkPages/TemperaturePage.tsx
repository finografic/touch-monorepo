import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect, useMemo, useRef } from 'react';
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
import {
  type TemperatureProfile,
  useGetTemperatureProfile,
} from 'queries/temperature/useGetTemperatureProfile';
import { reduceFilterProperty } from 'utils/filters.utils';
import { findClosestTemperature, getTimeValue } from 'utils/temperature.utils';
import { FilterKeys } from 'constants/filters.constants';

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

  const temperatureProfileId = reduceFilterProperty<{ temperatureProfileId: string }>({
    propKey: 'temperatureProfileId' as const,
    filters,
  });

  // Get temperature profile data
  const { data: temperatureProfile } = useGetTemperatureProfile({ id: temperatureProfileId });

  // Get consumption and freeze temperatures from filters
  const defaultTempConsume =
    Number(
      reduceFilterProperty<{ defaultTempConsume: number }>({
        propKey: 'defaultTempConsume' as const,
        filters,
      }),
    ) || FINAL_TEMP_DEFAULT;

  const defaultTempFreeze =
    Number(
      reduceFilterProperty<{ defaultTempFreeze: number }>({
        propKey: 'defaultTempFreeze' as const,
        filters,
      }),
    ) || undefined;

  // Track both temperatures for validation
  const temperatureRef = useRef({
    initial: INITIAL_TEMP_DEFAULT,
    final: defaultTempConsume,
  });

  // Calculate duration when temperatures or profile changes
  const duration = useMemo(() => {
    if (!temperatureProfile?.length) return 0;

    const initialTempRow = findClosestTemperature(temperatureProfile, temperatureRef.current.initial);
    const finalTempRow = findClosestTemperature(temperatureProfile, temperatureRef.current.final);

    // Example using element 1 (timeA) - this would need to be dynamic based on selected element
    const initialTime = getTimeValue(initialTempRow, 1);
    const finalTime = getTimeValue(finalTempRow, 1);

    return Math.abs(finalTime - initialTime);
  }, [temperatureProfile, temperatureRef.current.initial, temperatureRef.current.final]);

  // Update filters and validate when temperatures change
  const updateTemperatures = (initial: number, final: number) => {
    temperatureRef.current = { initial, final };

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

  // Initialize final temperature from filters when component mounts
  useEffect(
    function initializeFinalTemp() {
      if (!isInitializedRef.current && defaultTempConsume) {
        temperatureRef.current.final = defaultTempConsume;
        isInitializedRef.current = true;
      }
    },
    [defaultTempConsume],
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
            min={defaultTempFreeze ?? -Infinity} // Use freeze temp as min if available
            max={temperatureRef.current.initial} // Max should be current initial temp
            step={0.5}
          />
        </Box>
      </Flex>
    </Flex>
  );
};
