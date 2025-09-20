import { useCallback, useMemo, useRef } from 'react';
import { useFiltering } from 'hooks/useFiltering';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useOrders } from 'providers/OrdersProvider';
import { FINAL_TEMP_DEFAULT, INITIAL_TEMP_DEFAULT, MIN_TEMP_DIFFERENCE } from 'constants/temperature.config';
import { findClosestProfile } from 'utils/temperature.utils';
import { useFilters } from 'providers/FiltersProvider/FiltersContext';
import { OrderFieldKeys } from 'constants/app.config';

interface TemperatureState {
  initial: number;
  final: number;
}

interface UseTemperatureManagementProps {
  profiles: any[];
  dataFiltered: any[];
}

export const useTemperatureManagement = ({ profiles, dataFiltered }: UseTemperatureManagementProps) => {
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

  // ======================================================================== //

  const getTemperatureFilter = useCallback(
    ({ initial, final }: TemperatureState) => {
      // Find closest available profiles for initial and final temperatures
      const closestInitialProfile = findClosestProfile(profiles, initial, final);
      // const closestFinalProfile = findClosestProfile(profiles, final, final);
      // const usedInitial = closestInitialProfile ? closestInitialProfile.temperature : initial;
      // const usedFinal = closestFinalProfile ? closestFinalProfile.temperature : final;

      // log('📡 CLOSEST_1:', 'blue', { initial, final });
      // log('📡 CLOSEST_2:', 'blue', closestInitialProfile);
      // log('📡 CLOSEST_3:', 'blue', closestFinalProfile);
      // log('📡 CLOSEST_4:', 'blue', usedInitial, usedFinal);

      // return { ...filters.temperature, initial: usedInitial, final: usedFinal };
      // return { ...filters.temperature, initial, final };

      return {
        ...filters.temperature,
        closestTemperature: closestInitialProfile ? closestInitialProfile.temperature : initial,
        initial,
        final,
      };
    },
    [profiles, filters],
  );

  // ======================================================================== //

  // Simplified filter update - only update essential systems
  const updateFilters = useCallback(
    ({ initial, final }: TemperatureState) => {
      const temperatureFilter = getTemperatureFilter({ initial, final });
      const usedInitial = temperatureFilter.initial;
      const usedFinal = temperatureFilter.final;

      log('🚧 UPDATING FILTERS:', 'cyan', {
        fieldKey,
        temperatureFilter,
        NEW: temperatureFilter,
      });

      // ✅ ALSO update OrdersContext filters so useTemperatureControl can find them
      setOrdersFilters({ [fieldKey]: temperatureFilter });

      // TODO: V1: REMOVE Update global filters (essential for navigation)
      setFiltering(fieldKey, temperatureFilter);

      // NEW: V2
      setFilter(OrderFieldKeys.temperature, temperatureFilter);

      // Enable Next button only if final temp is less than initial by at least MIN_TEMP_DIFFERENCE
      setIsNextDisabled(usedFinal >= usedInitial - MIN_TEMP_DIFFERENCE);

      return { usedInitial, usedFinal };
    },
    [profiles, filters, setFilter, setFiltering, fieldKey, setIsNextDisabled, setOrdersFilters],
  );

  // Initialize temperatures with fallback values
  const initializeTemperatures = useCallback(
    (setTemperatures: (temps: TemperatureState) => void) => {
      if (refIsInitialized.current) return;

      const initial = INITIAL_TEMP_DEFAULT;
      const final = filters.temperature.defaultConsume ?? FINAL_TEMP_DEFAULT;
      const temperatureFilter = getTemperatureFilter({ initial, final });

      setTemperatures({ initial, final });
      updateFilters({ initial, final });

      // NEW: V2
      setFilter(OrderFieldKeys.temperature, temperatureFilter);

      refIsInitialized.current = true;
    },
    [defaultTempConsume, updateFilters],
  );

  // Update temperatures and filters
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
