import { useCallback, useMemo, useRef } from 'react';

import type { TemperatureState } from 'pages/TemperaturePage/TemperaturePage.types';

import { useFiltersContext } from 'providers/FiltersProvider/FiltersContext';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';

import { findClosestProfile } from 'utils/temperature.utils';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { TemperatureProfile } from 'types/temperature.types';
import { FINAL_TEMP_DEFAULT, INITIAL_TEMP_DEFAULT, MIN_TEMP_DIFFERENCE, ROUTE_FILTER_KEYS } from 'config/app';

interface UseTemperatureManagementProps {
  profiles: TemperatureProfile[];
  dataFiltered: OrderReadableModel[];
}

export const useTemperatureFormAndFilter = ({ profiles, dataFiltered }: UseTemperatureManagementProps) => {
  const refIsInitialized = useRef(false);
  const { filters, setFilter } = useFiltersContext();
  const { setIsNextDisabled } = usePagination();
  const { filterKey } = useRouteConfig();
  const { setFilters: setOrdersFilters } = useOrders();
  const { currentSessionId, sessions, updateSessionFilters } = useSession();

  // Get default consumption temperature from filtered data
  const defaultTempConsume = useMemo(() => {
    if (!dataFiltered?.length) return undefined;
    return dataFiltered[0].defaultTempConsume;
  }, [dataFiltered]);

  // Find the minimum available profile temperature and calculate min/max range
  const { minProfileTemp, minMaxTemperatures } = useMemo(() => {
    if (!profiles.length) {
      return {
        minProfileTemp: 0,
        minMaxTemperatures: { min: -10, max: 50 }, // Fallback values
      };
    }

    const temps = profiles.map((p) => p.temperature);
    return {
      minProfileTemp: Math.min(...temps),
      minMaxTemperatures: {
        min: Math.min(...temps),
        max: Math.max(...temps),
      },
    };
  }, [profiles]);

  const getTemperatureFilter = useCallback(
    ({ initial, final }: TemperatureState) => {
      const closestInitialProfile = findClosestProfile(profiles, initial, final);
      const closestFinalProfile = findClosestProfile(profiles, final, initial);

      return {
        ...filters.temperature,
        closestInitialTemperature: closestInitialProfile ? closestInitialProfile.temperature : initial,
        closestFinalTemperature: closestFinalProfile ? closestFinalProfile.temperature : final,
        initial,
        final,
      };
    },
    [profiles, filters],
  );

  const updateFilters = useCallback(
    ({ initial, final }: TemperatureState) => {
      const temperatureFilter = getTemperatureFilter({ initial, final });

      // Update global filters (essential for navigation)
      // setFiltering(filterKey, temperatureFilter);
      // NEW: V2
      setFilter(ROUTE_FILTER_KEYS.temperature, temperatureFilter);

      // ✅ ALSO update OrdersContext filters so useTemperatureControl can find them
      setOrdersFilters({ [filterKey]: temperatureFilter });

      // ✅ ADD: Update session filters with final temperature values
      if (currentSessionId) {
        const currentSessionFilters = sessions[currentSessionId]?.filters || {};
        const newSessionFilters = {
          ...currentSessionFilters,
          temperature: temperatureFilter,
        };
        updateSessionFilters(currentSessionId, newSessionFilters);
      }

      // Enable Next button only if final temp is less than initial by at least MIN_TEMP_DIFFERENCE
      setIsNextDisabled(temperatureFilter.final >= temperatureFilter.initial - MIN_TEMP_DIFFERENCE);
    },
    [
      profiles,
      filters,
      setFilter,
      // setFiltering,
      filterKey,
      setIsNextDisabled,
      setOrdersFilters,
      currentSessionId,
      sessions,
      updateSessionFilters,
    ],
  );

  const initializeTemperatures = useCallback(
    (setTemperatures: (temps: TemperatureState) => void) => {
      if (refIsInitialized.current) return;

      const initial = INITIAL_TEMP_DEFAULT;
      const final = filters.temperature.defaultConsume ?? FINAL_TEMP_DEFAULT;
      setTemperatures({ initial, final });
      updateFilters({ initial, final });

      refIsInitialized.current = true;
    },
    [defaultTempConsume, updateFilters],
  );

  const updateTemperatures = useCallback(
    (initial: number, final: number, setTemperatures: (temps: TemperatureState) => void) => {
      setTemperatures({ initial, final });
      updateFilters({ initial, final });
    },
    [updateFilters],
  );

  return {
    minProfileTemp,
    minMaxTemperatures,
    initializeTemperatures,
    updateTemperatures,
  };
};
