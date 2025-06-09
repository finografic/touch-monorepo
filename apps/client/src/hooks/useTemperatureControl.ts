import { useCallback, useDeferredValue, useEffect, useState } from 'react';
import { useFilters } from './useFilters';
import { OrderFieldKeys } from 'constants/app.config';
import { useGetTemperatureProfiles } from 'queries/temperature/useGetTemperatureProfiles';
import type { TemperatureFilter, TemperatureProfile } from 'types/temperature.types';
import { useConfigStorage } from './useConfigStorage';
import { useOrders } from 'providers/OrdersProvider';
import { ItemType } from 'types/orders.types';

interface UseTemperatureControlOptions {
  onSuccess?: (durations: Record<string, number>) => void;
  onError?: (error: Error) => void;
}

const getTimeValueForItemType = (
  initialProfile: TemperatureProfile,
  finalProfile: TemperatureProfile,
  itemType: ItemType,
): number => {
  let initialTime: number;
  let finalTime: number;

  switch (itemType) {
    case ItemType.A:
      initialTime = initialProfile.timeA;
      finalTime = finalProfile.timeA;
      break;
    case ItemType.B:
      initialTime = initialProfile.timeB;
      finalTime = finalProfile.timeB;
      break;
    case ItemType.C:
      initialTime = initialProfile.timeC;
      finalTime = finalProfile.timeC;
      break;
    default:
      return 0;
  }

  // Calculate operating time: final_time - initial_time
  const operatingTime = Math.abs(finalTime - initialTime);

  console.log(`Item ${itemType}: ${finalTime} - ${initialTime} = ${operatingTime} seconds`);

  return operatingTime;
};

export const useTemperatureControl = (options: UseTemperatureControlOptions = {}) => {
  const { filters } = useFilters();
  const [showLoading, setShowLoading] = useState(false);
  const { orders } = useOrders();
  const { saveConfig } = useConfigStorage();

  // Get current temperature filter values
  const currentFilter = filters[OrderFieldKeys.temperature] as TemperatureFilter | undefined;
  const { initial, final } = currentFilter || {};

  // Defer the query state to prevent UI flickering
  const deferredInitial = useDeferredValue(initial);
  const deferredFinal = useDeferredValue(final);

  // Get temperature profiles in one query
  const temperatureProfilesQuery = useGetTemperatureProfiles({
    initial: deferredInitial,
    final: deferredFinal,
    enabled: Boolean(deferredInitial && deferredFinal && currentFilter),
  });

  // Log temperature profiles when they change
  useEffect(() => {
    if (temperatureProfilesQuery.data) {
      console.log('Available temperature profiles:', temperatureProfilesQuery.data);
    }
  }, [temperatureProfilesQuery.data]);

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

  const startTemperatureControl = useCallback(async () => {
    try {
      if (!currentFilter?.initial || !currentFilter?.final) {
        throw new Error('Initial and final temperatures must be set');
      }

      // Get the temperature profiles data
      const profiles = temperatureProfilesQuery.data;
      if (!profiles) {
        throw new Error('Temperature profiles not available');
      }

      // log('__DEV: PROFILES', 'magenta', {
      //   initial: currentFilter.initial,
      //   final: currentFilter.final,
      //   profiles: profiles.map((p) => ({
      //     temp: p.temperature,
      //     timeA: p.timeA,
      //     timeB: p.timeB,
      //     timeC: p.timeC,
      //   })),
      // });

      // Find profiles for initial and final temperatures
      const initialProfile = profiles.find((p) => p.temperature === currentFilter.initial);
      const finalProfile = profiles.find((p) => p.temperature === currentFilter.final);

      if (!initialProfile) {
        throw new Error(
          `No temperature profile found for initial temperature ${currentFilter.initial}°C. Available profiles: ${profiles.map((p) => p.temperature).join(', ')}°C`,
        );
      }

      if (!finalProfile) {
        throw new Error(
          `No temperature profile found for final temperature ${currentFilter.final}°C. Available profiles: ${profiles.map((p) => p.temperature).join(', ')}°C`,
        );
      }

      console.log('Selected profiles:', {
        initial: {
          temp: initialProfile.temperature,
          timeA: initialProfile.timeA,
          timeB: initialProfile.timeB,
          timeC: initialProfile.timeC,
        },
        final: {
          temp: finalProfile.temperature,
          timeA: finalProfile.timeA,
          timeB: finalProfile.timeB,
          timeC: finalProfile.timeC,
        },
      });

      // Get selected orders
      const selectedOrders = orders.filter((order) => order.isSelected);
      if (selectedOrders.length === 0) {
        throw new Error('No orders selected');
      }

      // Calculate durations for each selected order based on their item type
      const calculatedDurations = selectedOrders.reduce<Record<string, number>>((acc, order) => {
        acc[order.itemNumber.toString()] = getTimeValueForItemType(
          initialProfile,
          finalProfile,
          order.itemType,
        );
        return acc;
      }, {});

      console.log('Calculated durations:', calculatedDurations);

      // Save configuration with calculated durations
      await saveConfig({
        filters: {
          temperature: {
            initial: currentFilter.initial,
            final: currentFilter.final,
            name: `${currentFilter.initial}°C → ${currentFilter.final}°C`,
            duration: Math.max(...Object.values(calculatedDurations)),
          },
        },
        temperatures: {
          default: currentFilter.initial,
          initial: currentFilter.initial,
          final: currentFilter.final,
        },
        durations: calculatedDurations,
        selectedOrders: selectedOrders.map((order) => order.itemNumber),
      });

      // Call onSuccess with the calculated durations map
      options.onSuccess?.(calculatedDurations);
    } catch (error) {
      console.error('Temperature control error:', error);
      options.onError?.(error as Error);
    }
  }, [currentFilter, temperatureProfilesQuery.data, orders, saveConfig, options.onSuccess, options.onError]);

  return {
    startTemperatureControl,
    temperatureProfilesQuery,
    isLoading: showLoading,
  };
};
