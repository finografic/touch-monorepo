import { useCallback, useDeferredValue, useEffect, useState } from 'react';
import { useFilters } from './useFilters';
import { OrderFieldKeys } from 'constants/app.config';
import { useGetTemperatureProfiles } from 'queries/temperature/useGetTemperatureProfiles';
import { getTimeValue } from 'utils/temperature.utils';
import type { TemperatureFilter, TemperatureProfile } from 'types/temperature.types';
import { reduceFilterProperty } from 'utils/filters.utils';
import { useConfigStorage } from './useConfigStorage';
import { useOrders } from 'providers/OrdersProvider';
import { ItemType } from 'types/orders.types';

interface UseTemperatureControlOptions {
  onSuccess?: (duration: number) => void;
  onError?: (error: Error) => void;
}

interface OrderDuration {
  itemNumber: number;
  duration: number;
}

const getTimeValueForItemType = (profile: TemperatureProfile, itemType: ItemType): number => {
  switch (itemType) {
    case ItemType.A:
      return profile.timeA;
    case ItemType.B:
      return profile.timeB;
    case ItemType.C:
      return profile.timeC;
    default:
      return 0;
  }
};

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
      }, 300);
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
        if (!currentFilter?.initial || !currentFilter?.final) {
          throw new Error('Initial and final temperatures must be set');
        }

        // Get the temperature profiles data
        const profiles = temperatureProfilesQuery.data;
        if (!profiles) {
          throw new Error('Temperature profiles not available');
        }

        // Find the profile for the temperature difference
        const temperatureDiff = Math.abs(currentFilter.final - currentFilter.initial);
        const profile = profiles.find((p) => p.temperature === temperatureDiff);
        if (!profile) {
          throw new Error(`No temperature profile found for difference of ${temperatureDiff}°C`);
        }

        // Get selected orders and their configurations
        const selectedOrders = orders.filter((order) => order.isSelected);
        if (selectedOrders.length === 0) {
          throw new Error('No orders selected');
        }

        // Calculate durations for each selected order based on their item type
        const orderDurations: OrderDuration[] = selectedOrders.map((order) => ({
          itemNumber: order.itemNumber,
          duration: getTimeValueForItemType(profile, order.itemType),
        }));

        // Create a map of durations by item number (as strings)
        const calculatedDurations = orderDurations.reduce<Record<string, number>>((acc, od) => {
          acc[od.itemNumber.toString()] = od.duration;
          return acc;
        }, {});

        // Save the configuration with actual temperature values and calculated durations
        await saveConfig({
          filters: {
            temperature: {
              initial: currentFilter.initial,
              final: currentFilter.final,
              name: `${currentFilter.initial}°C → ${currentFilter.final}°C`,
              duration: Math.max(...orderDurations.map((od) => od.duration)), // Use longest duration
            },
          },
          temperatures: {
            default: currentFilter.initial,
            initial: currentFilter.initial,
            final: currentFilter.final,
          },
          durations: {
            default: duration,
            ...calculatedDurations,
          },
          selectedOrders: selectedOrders.map((order) => order.itemNumber),
        });

        // Call onSuccess with the maximum duration (worst case)
        const maxDuration = Math.max(...orderDurations.map((od) => od.duration));
        options.onSuccess?.(maxDuration);
      } catch (error) {
        console.error('Temperature control error:', error);
        options.onError?.(error as Error);
      }
    },
    [
      currentFilter,
      elementNumber,
      temperatureProfilesQuery.data,
      orders,
      saveConfig,
      options.onSuccess,
      options.onError,
    ],
  );

  return {
    startTemperatureControl,
    temperatureProfilesQuery,
    isLoading: showLoading,
  };
};
