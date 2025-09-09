import { useCallback, useDeferredValue, useEffect, useState } from 'react';
// import { useFilters } from './useFilters'; // ✅ REMOVED: Now using OrdersContext.filters
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
      // 🔍 DEBUG: Log all the key data
      console.log('%c _TEMP: TEMPERATURE CONTROL DEBUG START', 'color: #ff6b35', '');
      console.log('%c _TEMP: filters', 'color: #ff6b35', filters);
      console.log('%c _TEMP: currentFilter', 'color: #ff6b35', currentFilter);
      console.log('%c _TEMP: profile', 'color: #ff6b35', profile);
      console.log('%c _TEMP: temperatureProfiles', 'color: #ff6b35', temperatureProfiles);
      console.log('%c _TEMP: orders', 'color: #ff6b35', orders);
      console.log(
        '%c _TEMP: selectedOrders',
        'color: #ff6b35',
        orders.filter((order) => order.isSelected),
      );

      if (!currentFilter?.initial || !currentFilter?.final) {
        console.error('%c _TEMP: ERROR: Missing temperature values', 'color: #ff0000');
        console.error('%c _TEMP: currentFilter available', 'color: #ff0000', !!currentFilter);
        console.error('%c _TEMP: initial temp', 'color: #ff0000', currentFilter?.initial);
        console.error('%c _TEMP: final temp', 'color: #ff0000', currentFilter?.final);
        throw new Error('Initial and final temperatures must be set');
      }

      // ✅ Get temperature profiles from profile object
      if (temperatureProfiles.length === 0) {
        throw new Error('Temperature profiles not available');
      }

      // Find closest available profiles for initial and final temperatures
      console.log(
        '%c _TEMP: Finding profiles for initial',
        'color: #ff6b35',
        currentFilter.initial,
        'final:',
        currentFilter.final,
      );

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

      console.log('%c _TEMP: Found initialProfile', 'color: #ff6b35', initialProfile);
      console.log('%c _TEMP: Found finalProfile', 'color: #ff6b35', finalProfile);

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

      // Get selected orders
      const selectedOrders = orders.filter((order) => order.isSelected);
      if (selectedOrders.length === 0) {
        throw new Error('No orders selected');
      }

      // Calculate durations for each selected order based on their item type
      console.log('%c _TEMP: Calculating durations for selectedOrders', 'color: #ff6b35', selectedOrders);

      const calculatedDurations = selectedOrders.reduce<Record<string, number>>((acc, order) => {
        const duration = getTimeValueForItemType(initialProfile, finalProfile, order.itemType);
        console.log(
          `%c _TEMP: Order ${order.itemNumber} (${order.itemType}): duration = ${duration}s`,
          'color: #ff6b35',
        );
        acc[order.itemNumber.toString()] = duration;
        return acc;
      }, {});

      console.log('%c _TEMP: calculatedDurations', 'color: #ff6b35', calculatedDurations);

      // Also calculate durations for all item types (A, B, C) for future use
      const itemTypeDurations = {
        [ItemType.A]: getTimeValueForItemType(initialProfile, finalProfile, ItemType.A),
        [ItemType.B]: getTimeValueForItemType(initialProfile, finalProfile, ItemType.B),
        [ItemType.C]: getTimeValueForItemType(initialProfile, finalProfile, ItemType.C),
      };

      // Save configuration with calculated durations for both selected orders and all item types
      const configToSave = {
        filters: {
          temperature: {
            initial: currentFilter.initial, // Use actual user input, not profile temperature
            final: currentFilter.final, // Use actual user input, not profile temperature
            name: `${currentFilter.initial}°C → ${currentFilter.final}°C`,
            duration: Math.max(...Object.values(calculatedDurations)),
          },
        },
        temperatures: {
          default: initialProfile.temperature,
          initial: currentFilter.initial, // Use actual user input
          final: currentFilter.final, // Use actual user input
        },
        durations: {
          ...calculatedDurations, // Individual order durations
          ...itemTypeDurations, // Item type durations (A, B, C)
          default: Math.max(...Object.values(calculatedDurations)),
        },
        selectedOrders: selectedOrders.map((order) => order.itemNumber),
      };

      console.log('%c _TEMP: Saving config', 'color: #ff6b35', configToSave);
      await saveConfig(configToSave);

      // Call onSuccess with the calculated durations map
      console.log('%c _TEMP: Calling onSuccess with durations', 'color: #ff6b35', calculatedDurations);
      options.onSuccess?.(calculatedDurations);

      console.log('%c _TEMP: TEMPERATURE CONTROL DEBUG END - SUCCESS', 'color: #00ff00', '');
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
