import { useCallback, useMemo, useRef } from 'react';
import { useFiltering } from 'hooks/useFiltering';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useOrders } from 'providers/OrdersProvider';
import { FINAL_TEMP_DEFAULT, INITIAL_TEMP_DEFAULT, MIN_TEMP_DIFFERENCE } from 'constants/temperature.config';
import { findClosestProfile } from 'utils/temperature.utils';
import { useFilters } from 'providers/FiltersProvider/FiltersContext';
import { OrderFieldKeys } from 'constants/app.config';
import type { TemperatureState } from 'pages/TemperaturePage/TemperaturePage.types';
import type { TemperatureProfile } from 'types/temperature.types';
import type { OrderReadableModel } from 'types/models/order-readable.model';

interface UseTemperatureManagementProps {
  profiles: TemperatureProfile[];
  dataFiltered: OrderReadableModel[];
}

export const useFormStateAndTemperatureFilter = ({
  profiles,
  dataFiltered,
}: UseTemperatureManagementProps) => {
  const refIsInitialized = useRef(false);
  const { setFilter: setFiltering } = useFiltering();
  const { filters, setFilter } = useFilters();
  const { setIsNextDisabled } = usePagination();
  const { fieldKey } = useRouteConfig();
  const { setFilters: setOrdersFilters } = useOrders();

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

      // TODO: V1: REMOVE Update global filters (essential for navigation)
      setFiltering(fieldKey, temperatureFilter);
      // NEW: V2
      setFilter(OrderFieldKeys.temperature, temperatureFilter);

      // ✅ ALSO update OrdersContext filters so useTemperatureControl can find them
      setOrdersFilters({ [fieldKey]: temperatureFilter });

      // Enable Next button only if final temp is less than initial by at least MIN_TEMP_DIFFERENCE
      setIsNextDisabled(temperatureFilter.final >= temperatureFilter.initial - MIN_TEMP_DIFFERENCE);
    },
    [profiles, filters, setFilter, setFiltering, fieldKey, setIsNextDisabled, setOrdersFilters],
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
