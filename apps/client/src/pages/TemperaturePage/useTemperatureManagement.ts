import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFilters } from 'hooks/useFilters';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { TemperatureKey } from 'types/temperature.types';
import { INITIAL_TEMP_DEFAULT, MIN_TEMP_DIFFERENCE } from 'constants/temperature.config';
import { findClosestProfile } from 'utils/temperature.utils';

interface TemperatureState {
  initial: number;
  final: number;
}

interface UseTemperatureManagementProps {
  orders: any[];
  profiles: any[];
  dataFiltered: any[];
}

export const useTemperatureManagement = ({
  orders,
  profiles,
  dataFiltered,
}: UseTemperatureManagementProps) => {
  const isInitializedRef = useRef(false);
  const { setOrdersFilter } = useOrders();
  const { currentSessionId, updateSessionFilters } = useSession();
  const { setFilter } = useFilters();
  const { setIsNextDisabled } = usePagination();
  const { fieldKey } = useRouteConfig();

  // Get default consumption temperature from filtered data
  const defaultTempConsume = useMemo(() => {
    if (!dataFiltered?.length) return undefined;
    return dataFiltered[0].defaultTempConsume;
  }, [dataFiltered]);

  // Find the minimum available profile temperature
  const minProfileTemp = useMemo(() => {
    if (!profiles.length) return 0;
    return Math.min(...profiles.map((p) => p.temperature));
  }, [profiles]);

  // Update filters for orders and session
  const updateFilters = useCallback(
    (initial: number, final: number) => {
      if (!orders?.length || !currentSessionId) return;

      // Find closest available profiles for initial and final temperatures
      const closestInitialProfile = findClosestProfile(profiles, initial, final);
      const closestFinalProfile = findClosestProfile(profiles, final, final);
      const usedInitial = closestInitialProfile ? closestInitialProfile.temperature : initial;
      const usedFinal = closestFinalProfile ? closestFinalProfile.temperature : final;

      // Only update orders in the current session
      const sessionOrders = orders.filter((order) => order.session?.id === currentSessionId);

      for (const order of sessionOrders) {
        const currentFilters = order.filters || {};
        const lookup = { initial: usedInitial, final: usedFinal, name: `${usedInitial}°C → ${usedFinal}°C` };
        setOrdersFilter({
          itemNumber: order.itemNumber,
          filter: { ...currentFilters, [fieldKey]: { initial: usedInitial, final: usedFinal, lookup } },
        });
      }

      // Update session filters
      if (currentSessionId) {
        const prevSessionFilters = orders.find((o) => o.session?.id === currentSessionId)?.filters || {};
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

      // Update global filters
      setFilter(fieldKey, {
        initial: usedInitial,
        final: usedFinal,
        lookup: { initial: usedInitial, final: usedFinal, name: `${usedInitial}°C → ${usedFinal}°C` },
      });

      // Enable Next button only if final temp is less than initial by at least MIN_TEMP_DIFFERENCE
      setIsNextDisabled(usedFinal >= usedInitial - MIN_TEMP_DIFFERENCE);

      return { usedInitial, usedFinal };
    },
    [
      orders,
      currentSessionId,
      profiles,
      setOrdersFilter,
      updateSessionFilters,
      fieldKey,
      setFilter,
      setIsNextDisabled,
    ],
  );

  // Initialize temperatures with fallback values
  const initializeTemperatures = useCallback(
    (setTemperatures: (temps: TemperatureState) => void) => {
      if (!isInitializedRef.current) {
        const initial = INITIAL_TEMP_DEFAULT;
        const final = defaultTempConsume ?? 8;
        const newTemperatures = { initial, final };
        setTemperatures(newTemperatures);

        updateFilters(initial, final);
        isInitializedRef.current = true;
      }
    },
    [defaultTempConsume, updateFilters],
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
    initializeTemperatures,
    updateTemperatures,
    isInitialized: isInitializedRef.current,
  };
};
