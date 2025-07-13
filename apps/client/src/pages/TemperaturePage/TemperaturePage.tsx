import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PadTemperature } from 'components/Pads/PadTemperature/PadTemperature';
import type { Temperature } from 'types/orders.types';
import { useFilters } from 'hooks/useFilters';
import { Box, Flex } from '@radix-ui/themes';
import { stylesAppContent } from 'styles/custom/content.app.styles';
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
import { styles } from './TemperaturePage.styles';
import { useGetTemperatureProfiles } from 'queries/temperature/useGetTemperatureProfiles';
import { findClosestProfile } from 'utils/temperature.utils';

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

  // ======================================================================== //
  // Fetch all temperature profiles for the current orderId
  const temperatureProfilesQuery = useGetTemperatureProfiles({
    orderId: orders[0]?.id,
    enabled: Boolean(orders[0]?.id),
  });

  const profiles = temperatureProfilesQuery.data ?? [];
  const isLoadingProfiles = temperatureProfilesQuery.isLoading;
  const isPendingProfiles = temperatureProfilesQuery.isPending;
  const profilesError = temperatureProfilesQuery.error;
  // ======================================================================== //

  // Find the closest temperature profile for the current selection
  // Find the minimum available profile temperature
  const minProfileTemp = useMemo(() => {
    if (!profiles.length) return INITIAL_TEMP_MIN;
    return Math.min(...profiles.map((p) => p.temperature));
  }, [profiles]);
  const closestProfile = useMemo(() => {
    if (!profiles.length) return null;
    return findClosestProfile(profiles, temperatures.initial, temperatures.final);
  }, [profiles, temperatures.initial, temperatures.final]);

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
        // Only update the temperature field, preserve all other filters
        const lookup = { initial, final, name: `${initial}°C → ${final}°C` };
        setOrdersFilter({
          itemNumber: order.itemNumber,
          filter: { ...currentFilters, [fieldKey]: { initial, final, lookup } },
        });
      }

      // Also update session filters, but preserve all other filters
      if (currentSessionId) {
        // Get the current session filters (if any)
        const prevSessionFilters =
          orders.find((o) => o.configurationSessionId === currentSessionId)?.filters || {};
        const sessionFilters = {
          ...prevSessionFilters,
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

      // Find closest available profiles for initial and final temperatures
      const profiles = temperatureProfilesQuery?.data ?? [];
      const closestInitialProfile = findClosestProfile(profiles, initial, final);
      const closestFinalProfile = findClosestProfile(profiles, final, final);
      const usedInitial = closestInitialProfile ? closestInitialProfile.temperature : initial;
      const usedFinal = closestFinalProfile ? closestFinalProfile.temperature : final;

      // Only update orders in the current session
      const sessionOrders = orders.filter((order) => order.configurationSessionId === currentSessionId);

      for (const order of sessionOrders) {
        const currentFilters = order.filters || {};
        // Only update the temperature field, preserve all other filters
        const lookup = { initial: usedInitial, final: usedFinal, name: `${usedInitial}°C → ${usedFinal}°C` };
        setOrdersFilter({
          itemNumber: order.itemNumber,
          filter: { ...currentFilters, [fieldKey]: { initial: usedInitial, final: usedFinal, lookup } },
        });
      }

      // Also update session filters, but preserve all other filters
      if (currentSessionId) {
        const prevSessionFilters =
          orders.find((o) => o.configurationSessionId === currentSessionId)?.filters || {};
        const sessionFilters = {
          ...prevSessionFilters,
          [fieldKey]: {
            initial: usedInitial,
            final: usedFinal,
            lookup: { initial: usedInitial, final: usedFinal, name: `${usedInitial}°C → ${usedFinal}°C` },
          },
        };
        updateSessionFilters(currentSessionId, sessionFilters);
      }

      // Enable Next button only if final temp is less than initial by at least MIN_TEMP_DIFFERENCE
      setIsNextDisabled(usedFinal >= usedInitial - MIN_TEMP_DIFFERENCE);
    },
    [
      setOrdersFilter,
      setIsNextDisabled,
      currentSessionId,
      updateSessionFilters,
      fieldKey,
      orders,
      temperatureProfilesQuery,
    ],
  );

  // Log session filters after every temperature change for debugging
  useEffect(() => {
    if (currentSessionId) {
      console.log(
        'Session filters after temperature change:',
        orders.find((o) => o.configurationSessionId === currentSessionId)?.filters,
      );
    }
  }, [temperatures, currentSessionId, orders]);

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
  if ((isLoadingTemperatures && !minMaxError) || isLoadingProfiles || !isInitializedRef.current) {
    return (
      <Flex css={stylesAppContent} className="temperature-content" gap="3" direction="column">
        <Box>Loading temperature settings...</Box>
      </Flex>
    );
  }

  if (profilesError) {
    return (
      <Flex css={stylesAppContent} className="temperature-content" gap="3" direction="column">
        <Box>Error loading temperature profiles.</Box>
      </Flex>
    );
  }

  return (
    <Flex css={stylesAppContent} className="temperature-content" gap="3" direction="column">
      <Flex direction="column" gap="3" justify="center" css={styles}>
        <Flex gap="3" justify="center" className="page-description">
          <Box>
            <p style={{ textAlign: 'center' }}>{DESCRIPTIONS.page}</p>
            {closestProfile !== null && (
              <>
                <div style={{ color: 'orange', marginTop: 8, textAlign: 'center' }}>
                  Closest available profile: {closestProfile.temperature}°C
                </div>
                <div
                  style={{
                    color: 'orange',
                    opacity: 0.6,
                    marginTop: 4,
                    textAlign: 'center',
                    fontSize: '0.7em',
                  }}
                >
                  Available profiles: [
                  {profiles.map((p, i) => (
                    <span key={p.id}>
                      {p.temperature}
                      {i < profiles.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                  ]
                </div>
              </>
            )}
          </Box>
        </Flex>
        <Flex gap="3" justify="center" className="temperature-content">
          <Box>
            <PadTemperature
              name={TemperatureKey.Initial}
              value={temperatures.initial}
              onChange={handleChange}
              label={DESCRIPTIONS.initial.label}
              min={minProfileTemp}
              max={minMaxTemperatures?.max ?? INITIAL_TEMP_MAX}
              step={0.5}
            />
          </Box>
          <Box>
            <PadTemperature
              name={TemperatureKey.Final}
              value={temperatures.final}
              onChange={handleChange}
              label={DESCRIPTIONS.final.label}
              min={minMaxTemperatures?.min ?? FINAL_TEMP_MIN}
              max={temperatures.initial - MIN_TEMP_DIFFERENCE}
              step={0.5}
            />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};
