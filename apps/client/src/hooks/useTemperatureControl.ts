import { useCallback, useDeferredValue, useEffect, useState } from 'react';
import { useFilters } from './useFilters';
import { OrderFieldKeys } from 'constants/app.config';
import type { TemperatureFilter, TemperatureProfile } from 'types/temperature.types';
import { useConfigStorage } from './useConfigStorage';
import { useOrders } from 'providers/OrdersProvider';
import { ItemType } from 'types/orders.types';
import { findClosestProfile } from 'utils/temperature.utils';

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
  const [showLoading, setShowLoading] = useState(false);
  const { orders, profile, filters } = useOrders(); // ✅ Get profile directly
  const { saveConfig } = useConfigStorage();

  // Get current temperature filter values
  // SAFEGUARD: filters may not be available yet, or may not have the temperature key
  const currentFilter: TemperatureFilter | undefined =
    filters && OrderFieldKeys.temperature in filters
      ? (filters[OrderFieldKeys.temperature] as TemperatureFilter)
      : undefined;
  const { initial, final } = currentFilter || {};

  // Defer the query state to prevent UI flickering
  const deferredInitial = useDeferredValue(initial);
  const deferredFinal = useDeferredValue(final);

  // ✅ NEW: Get temperature profiles directly from profile
  const temperatureProfiles = profile?.temperatureProfiles || [];

  // ======================================================================== //

  // Log temperature profiles when they change
  useEffect(() => {
    if (temperatureProfiles.length > 0) {
      console.log('Available temperature profiles:', temperatureProfiles);
    }
  }, [temperatureProfiles]);

  // ✅ SIMPLIFIED: No more complex query logic
  const isLoading = !profile || temperatureProfiles.length === 0;

  // ======================================================================== //

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

  // ======================================================================== //

  const startTemperatureControl = useCallback(async () => {
    try {
      if (!filters || !currentFilter?.initial || !currentFilter?.final) {
        throw new Error('Initial and final temperatures must be set, and filters must be available');
      }

      // ✅ Get temperature profiles from profile object
      if (temperatureProfiles.length === 0) {
        throw new Error('Temperature profiles not available');
      }

      // Find closest available profiles for initial and final temperatures
      const initialProfile = findClosestProfile(
        temperatureProfiles,
        currentFilter.initial,
        currentFilter.final,
      ) as TemperatureProfile;
      const finalProfile = findClosestProfile(
        temperatureProfiles,
        currentFilter.final,
        currentFilter.final,
      ) as TemperatureProfile;

      if (!initialProfile) {
        throw new Error(
          `No temperature profile found for initial temperature ${currentFilter.initial}°C. Available profiles: ${temperatureProfiles.map((p) => p.temperature).join(', ')}°C`,
        );
      }

      if (!finalProfile) {
        throw new Error(
          `No temperature profile found for final temperature ${currentFilter.final}°C. Available profiles: ${temperatureProfiles.map((p) => p.temperature).join(', ')}°C`,
        );
      }

      console.log('Selected profiles (using closest if needed):', {
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

      // Also calculate durations for all item types (A, B, C) for future use
      const itemTypeDurations = {
        [ItemType.A]: getTimeValueForItemType(initialProfile, finalProfile, ItemType.A),
        [ItemType.B]: getTimeValueForItemType(initialProfile, finalProfile, ItemType.B),
        [ItemType.C]: getTimeValueForItemType(initialProfile, finalProfile, ItemType.C),
      };

      console.log('Calculated durations:', calculatedDurations);
      console.log('Item type durations for future use:', itemTypeDurations);

      // Save configuration with calculated durations for both selected orders and all item types
      await saveConfig({
        filters: {
          temperature: {
            initial: initialProfile.temperature,
            final: finalProfile.temperature,
            name: `${initialProfile.temperature}°C → ${finalProfile.temperature}°C`,
            duration: Math.max(...Object.values(calculatedDurations)),
          },
        },
        temperatures: {
          default: initialProfile.temperature,
          initial: initialProfile.temperature,
          final: finalProfile.temperature,
        },
        durations: {
          ...calculatedDurations, // Individual order durations
          ...itemTypeDurations, // Item type durations (A, B, C)
          default: Math.max(...Object.values(calculatedDurations)),
        },
        selectedOrders: selectedOrders.map((order) => order.itemNumber),
      });

      // Call onSuccess with the calculated durations map
      options.onSuccess?.(calculatedDurations);
    } catch (error) {
      console.error('Temperature control error:', error);
      options.onError?.(error as Error);
    }
  }, [
    filters,
    currentFilter,
    temperatureProfiles, // ✅ Use temperatureProfiles instead of query
    orders,
    saveConfig,
    options.onSuccess,
    options.onError,
  ]);

  return {
    startTemperatureControl,
    // ✅ REMOVE: temperatureProfilesQuery - no longer needed
    isLoading: showLoading,
  };
};
