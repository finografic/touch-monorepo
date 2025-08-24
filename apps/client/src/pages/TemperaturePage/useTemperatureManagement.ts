import { useCallback, useMemo, useState } from 'react';
import { useFilters } from 'hooks/useFilters';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { INITIAL_TEMP_DEFAULT, MIN_TEMP_DIFFERENCE } from 'constants/temperature.config';
import { findClosestProfile } from 'utils/temperature.utils';

interface TemperatureState {
  initial: number;
  final: number;
}

interface UseTemperatureManagementProps {
  profiles: any[];
  dataFiltered: any[];
}

export const useTemperatureManagement = ({ profiles, dataFiltered }: UseTemperatureManagementProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { setFilter } = useFilters();
  const { setIsNextDisabled } = usePagination();
  const { fieldKey } = useRouteConfig();

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

  // Simplified filter update - only update essential systems
  const updateFilters = useCallback(
    (initial: number, final: number) => {
      // Find closest available profiles for initial and final temperatures
      const closestInitialProfile = findClosestProfile(profiles, initial, final);
      const closestFinalProfile = findClosestProfile(profiles, final, final);
      const usedInitial = closestInitialProfile ? closestInitialProfile.temperature : initial;
      const usedFinal = closestFinalProfile ? closestFinalProfile.temperature : final;

      // Update global filters (essential for navigation)
      setFilter(fieldKey, {
        initial: usedInitial,
        final: usedFinal,
        lookup: { initial: usedInitial, final: usedFinal, name: `${usedInitial}°C → ${usedFinal}°C` },
      });

      // Enable Next button only if final temp is less than initial by at least MIN_TEMP_DIFFERENCE
      setIsNextDisabled(usedFinal >= usedInitial - MIN_TEMP_DIFFERENCE);

      return { usedInitial, usedFinal };
    },
    [profiles, setFilter, fieldKey, setIsNextDisabled],
  );

  // Initialize temperatures with fallback values
  const initializeTemperatures = useCallback(
    (setTemperatures: (temps: TemperatureState) => void) => {
      if (!isInitialized) {
        const initial = INITIAL_TEMP_DEFAULT;
        const final = defaultTempConsume ?? 8;
        const newTemperatures = { initial, final };
        setTemperatures(newTemperatures);

        updateFilters(initial, final);
        setIsInitialized(true);
      }
    },
    [defaultTempConsume, updateFilters, isInitialized],
  );

  // Update temperatures and filters
  const updateTemperatures = useCallback(
    (initial: number, final: number, setTemperatures: (temps: TemperatureState) => void) => {
      setTemperatures({ initial, final });
      updateFilters(initial, final);
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
