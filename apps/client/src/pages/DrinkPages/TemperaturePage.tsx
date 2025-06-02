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

interface TemperatureState {
  initial: number;
  final: number;
}

const DESCRIPTIONS = {
  initial: {
    label: 'temperatura inicial',
    description: 'por defecto, la temperatura ambiente suministrada',
  },
  final: {
    label: 'temperatura final',
    description: 'por defecto, la temperatura de consumo recomendada',
  },
  page: 'By default, it indicates the ambient temperature supplied by a probe. The user can modify it using the + and - buttons. Units are in degrees Celsius with one decimal place.',
} as const;

export const TemperaturePage = () => {
  const isInitializedRef = useRef(false);
  const { dataFiltered, setFilter } = useFilters();
  const { setIsNextDisabled } = usePagination();

  const [temperatures, setTemperatures] = useState<TemperatureState>({
    initial: INITIAL_TEMP_DEFAULT,
    final: INITIAL_TEMP_DEFAULT,
  });

  // Get min and max allowed temperatures
  const { data: minMaxTemperatures, isLoading: isLoadingTemperatures } = useGetMinMaxTemperatures();

  // Get default consumption temperature from filtered data
  const defaultTempConsume = useMemo(() => {
    if (!dataFiltered?.length) return undefined;
    return dataFiltered[0].defaultTempConsume;
  }, [dataFiltered]);

  // Initialize final temperature when default consumption temp is available
  useEffect(() => {
    if (!isInitializedRef.current && defaultTempConsume) {
      const newTemperatures = {
        initial: INITIAL_TEMP_DEFAULT,
        final: defaultTempConsume,
      };
      setTemperatures(newTemperatures);

      // Set initial filter
      setFilter(OrderFieldKeys.temperature, {
        ...newTemperatures,
        name: `${newTemperatures.initial}°C → ${newTemperatures.final}°C`,
      });

      isInitializedRef.current = true;
    }
  }, [defaultTempConsume, setFilter]);

  // Update filters and validate when temperatures change
  const updateTemperatures = (initial: number, final: number) => {
    setTemperatures({ initial, final });

    // Update the filter with both temperatures
    setFilter(OrderFieldKeys.temperature, {
      initial,
      final,
      name: `${initial}°C → ${final}°C`,
    });

    // Enable Next button only if final temp is less than initial by at least MIN_TEMP_DIFFERENCE
    setIsNextDisabled(final >= initial - MIN_TEMP_DIFFERENCE);
  };

  const handleInitialTempChange = (temp: Temperature) => {
    const initial = temp.value;
    const final = temperatures.final;

    // If initial temp is decreased, ensure final temp maintains MIN_TEMP_DIFFERENCE
    const adjustedFinal = Math.min(final, initial - MIN_TEMP_DIFFERENCE);
    updateTemperatures(initial, adjustedFinal);
  };

  const handleFinalTempChange = (temp: Temperature) => {
    const initial = temperatures.initial;
    const final = temp.value;
    updateTemperatures(initial, final);
  };

  // Don't show inputs until we have the temperature constraints and default values
  if (isLoadingTemperatures || !isInitializedRef.current) {
    return (
      <Flex css={styles} className="temperature-content" gap="3" direction="column">
        <Box>Loading temperature settings...</Box>
      </Flex>
    );
  }

  return (
    <Flex css={styles} className="temperature-content" gap="3" direction="column">
      <Flex className="page-description" gap="3" justify="center">
        <Box>
          <p>{DESCRIPTIONS.page}</p>
        </Box>
      </Flex>
      <Flex gap="3" justify="center">
        <Box>
          <TemperatureInput
            value={temperatures.initial}
            onChange={handleInitialTempChange}
            label={DESCRIPTIONS.initial.label}
            description={DESCRIPTIONS.initial.description}
            min={minMaxTemperatures?.min ?? INITIAL_TEMP_MIN}
            max={minMaxTemperatures?.max ?? INITIAL_TEMP_MAX}
            step={0.5}
          />
        </Box>
        <Box>
          <TemperatureInput
            value={temperatures.final}
            onChange={handleFinalTempChange}
            label={DESCRIPTIONS.final.label}
            description={DESCRIPTIONS.final.description}
            min={minMaxTemperatures?.min ?? FINAL_TEMP_MIN}
            max={temperatures.initial - MIN_TEMP_DIFFERENCE}
            step={0.5}
          />
        </Box>
      </Flex>
    </Flex>
  );
};
