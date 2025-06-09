import { useCallback, useDeferredValue, useEffect, useState } from 'react';
import { useFilters } from './useFilters';
import { OrderFieldKeys } from 'constants/app.config';
import { useGetTemperatureProfiles } from 'queries/temperature/useGetTemperatureProfiles';
import { getTimeValue } from 'utils/temperature.utils';
import type { TemperatureFilter } from 'types/temperature.types';
import { reduceFilterProperty } from 'utils/filters.utils';
import { useConfigStorage } from './useConfigStorage';
import { useOrders } from 'providers/OrdersProvider';

interface UseTemperatureControlOptions {
  onSuccess?: (duration: number) => void;
  onError?: (error: Error) => void;
}

export const useTemperatureControl = (options: UseTemperatureControlOptions = {}) => {
  // log('__DEV: options', 'orange', options);
  const { filters, setFilter } = useFilters();
  const [showLoading, setShowLoading] = useState(false);
  const { orders } = useOrders();
  const { saveConfig } = useConfigStorage();

  // Get element number from filters (defaulting to 1 for now)
  const elementNumber =
    Number(
      reduceFilterProperty<{ elementNumber: number }>({
        propKey: 'elementNumber' as const,
        filters,
      }),
    ) || 1;

  // Get current temperature filter values
  const currentFilter = filters[OrderFieldKeys.temperature] as TemperatureFilter | undefined;
  const { initial, final } = currentFilter || {};

  // log('__DEV: CURRENT', 'orange', { currentFilter, initial, final });

  // Defer the query state to prevent UI flickering
  const deferredInitial = useDeferredValue(initial);
  const deferredFinal = useDeferredValue(final);

  // Get both temperature profiles in one query
  const temperatureProfilesQuery = useGetTemperatureProfiles({
    initial: deferredInitial,
    final: deferredFinal,
    enabled: Boolean(deferredInitial && deferredFinal && currentFilter),
  });

  // Compute loading state that includes both immediate and deferred states
  const isLoading =
    temperatureProfilesQuery.isFetching || initial !== deferredInitial || final !== deferredFinal;

  // Add delay before showing loading state
  useEffect(() => {
    let timeoutId: number;

    if (isLoading) {
      timeoutId = window.setTimeout(() => {
        setShowLoading(true);
      }, 300); // Only show loading after 500ms of actual loading
    } else {
      setShowLoading(false);
    }

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isLoading]);

  const startTemperatureControl = useCallback(
    async (duration: number = 300) => {
      try {
        // Save the current configuration
        const selectedOrders = orders.filter((order) => order.isSelected);
        saveConfig({
          filters: {},
          temperatures: { default: 25 },
          durations: { default: duration },
          selectedOrders: selectedOrders.map((order) => order.itemNumber),
        });

        // Call onSuccess with the duration
        options.onSuccess?.(duration);
      } catch (error) {
        console.error('Temperature control error:', error);
        options.onError?.(error as Error);
      }
    },
    [orders, saveConfig, options.onSuccess, options.onError],
  );

  return {
    startTemperatureControl,
    temperatureProfilesQuery,
    isLoading: showLoading, // Use the delayed loading state
  };
};
