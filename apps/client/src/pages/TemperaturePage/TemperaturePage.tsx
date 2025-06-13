import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TemperatureInput } from 'components/TemperatureInput/TemperatureInput';
import type { Temperature } from 'types/orders.types';
import { useFilters } from 'hooks/useFilters';
import { Box, Flex } from '@radix-ui/themes';
import { styles } from '../content.styles';
import {
  FINAL_TEMP_MIN,
  INITIAL_TEMP_DEFAULT,
  INITIAL_TEMP_MAX,
  INITIAL_TEMP_MIN,
  MIN_TEMP_DIFFERENCE,
} from 'constants/temperature.config';
import { useGetMinMaxTemperatures } from 'queries/temperature/useGetMinMaxTemperatures';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { TemperatureKey } from 'types/temperature.types';

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
  const { orders, setOrdersFilter } = useOrders();
  const { currentSessionId, updateSessionFilters } = useSession();
  const { dataFiltered, setFilter } = useFilters();
  const { setIsNextDisabled } = usePagination();

  const [temperatures, setTemperatures] = useState<TemperatureState>({
    [TemperatureKey.Initial]: INITIAL_TEMP_DEFAULT,
    [TemperatureKey.Final]: INITIAL_TEMP_DEFAULT,
  });

  const { route, fieldKey, filterKey, loaderData } = useRouteConfig();

  // Get min and max allowed temperatures
  const {
    data: minMaxTemperatures,
    isLoading: isLoadingTemperatures,
    error: minMaxError,
  } = useGetMinMaxTemperatures();

  // Get default consumption temperature from filtered data
  const defaultTempConsume = useMemo(() => {
    if (!dataFiltered?.length) return undefined;
    return dataFiltered[0].defaultTempConsume;
  }, [dataFiltered]);

  // Initialize temperatures with fallback values
  useEffect(() => {
    if (!isInitializedRef.current) {
      const initial = INITIAL_TEMP_DEFAULT;
      // Use defaultTempConsume if available, otherwise fallback to 8°C
      const final = defaultTempConsume ?? 8;
      const newTemperatures = { initial, final };
      setTemperatures(newTemperatures);

      // Only update orders in the current session
      const sessionOrders = orders.filter((order) => order.configurationSessionId === currentSessionId);

      for (const order of sessionOrders) {
        const currentFilters = order.filters || {};
        const lookup = { initial, final, name: `${initial}°C → ${final}°C` };
        setOrdersFilter({
          itemNumber: order.itemNumber,
          filter: { ...currentFilters, [fieldKey]: { initial, final, lookup } },
        });
      }

      // Also update session filters so useTemperatureControl can access them
      if (currentSessionId) {
        const sessionFilters = {
          [fieldKey]: { initial, final, lookup: { initial, final, name: `${initial}°C → ${final}°C` } },
        };
        updateSessionFilters(currentSessionId, sessionFilters);
      }

      isInitializedRef.current = true;
    }
  }, [
    defaultTempConsume,
    setFilter,
    orders,
    fieldKey,
    setOrdersFilter,
    currentSessionId,
    updateSessionFilters,
  ]);

  // Update filters and validate when temperatures change
  const updateTemperatures = useCallback(
    (initial: number, final: number) => {
      setTemperatures({ initial, final });

      if (!orders?.length || !currentSessionId) return;

      // Only update orders in the current session
      const sessionOrders = orders.filter((order) => order.configurationSessionId === currentSessionId);

      for (const order of sessionOrders) {
        const currentFilters = order.filters || {};
        const lookup = { initial, final, name: `${initial}°C → ${final}°C` };
        setOrdersFilter({
          itemNumber: order.itemNumber,
          filter: { ...currentFilters, [fieldKey]: { initial, final, lookup } },
        });
      }

      // Also update session filters so useTemperatureControl can access them
      if (currentSessionId) {
        const sessionFilters = {
          [fieldKey]: { initial, final, lookup: { initial, final, name: `${initial}°C → ${final}°C` } },
        };
        updateSessionFilters(currentSessionId, sessionFilters);
      }

      // Enable Next button only if final temp is less than initial by at least MIN_TEMP_DIFFERENCE
      setIsNextDisabled(final >= initial - MIN_TEMP_DIFFERENCE);
    },
    [setOrdersFilter, setIsNextDisabled, currentSessionId, updateSessionFilters, fieldKey],
  );

  const handleChange = (name: TemperatureKey, temp: Temperature) => {
    const update = { ...temperatures, [name]: temp.value };

    if (name === TemperatureKey.Initial) {
      const adjustedFinal = Math.min(update.final, update.initial - MIN_TEMP_DIFFERENCE);
      Object.assign(update, { [TemperatureKey.Final]: adjustedFinal });
    }

    updateTemperatures(update.initial, update.final);
  };

  // Don't show inputs until we have the temperature constraints and default values
  // Allow proceeding if minMax query failed (use fallback values) but still loading
  if ((isLoadingTemperatures && !minMaxError) || !isInitializedRef.current) {
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
            name={TemperatureKey.Initial}
            value={temperatures.initial}
            onChange={handleChange}
            label={DESCRIPTIONS.initial.label}
            description={DESCRIPTIONS.initial.description}
            min={minMaxTemperatures?.min ?? INITIAL_TEMP_MIN}
            max={minMaxTemperatures?.max ?? INITIAL_TEMP_MAX}
            step={0.5}
          />
        </Box>
        <Box>
          <TemperatureInput
            name={TemperatureKey.Final}
            value={temperatures.final}
            onChange={handleChange}
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
