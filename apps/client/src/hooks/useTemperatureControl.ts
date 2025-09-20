import { useCallback, useDeferredValue, useEffect, useState } from 'react';
// import { useFiltering } from './useFiltering'; // ✅ REMOVED: Now using OrdersContext.filters
import { OrderFieldKeys } from 'constants/app.config';
import type { TemperatureFilter, TemperatureProfile } from 'types/temperature.types';
import { useConfigStorage } from './useConfigStorage';
import { useOrders } from 'providers/OrdersProvider';
import { ItemType } from 'types/orders.types';
import { findClosestProfile } from 'utils/temperature.utils';
import { useFilters } from 'providers/FiltersProvider';

interface UseTemperatureControlOptions {
  onSuccess?: (durations: Record<string, number>) => void;
  onError?: (error: Error) => void;
}

export const useTemperatureControl = (options: UseTemperatureControlOptions = {}) => {
  const [showLoading, setShowLoading] = useState(false);
  const { orders, profile, filters: filtersOrders } = useOrders(); // ✅ Get profile directly
  const { filters } = useFilters(); // ✅ Get profile directly
  const { saveConfig } = useConfigStorage();

  const temperatureFilter = useDeferredValue(filters.temperature);
  const temperatureProfiles = temperatureFilter.temperatureProfiles || [];

  const isLoading = !profile || temperatureProfiles.length === 0;

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
      if (!temperatureFilter?.initial || !temperatureFilter?.final) {
        throw new Error('Initial and final temperatures must be set');
      }

      // ✅ Get temperature profiles from FiltersContext
      if (temperatureProfiles.length === 0) {
        throw new Error('Temperature profiles not available');
      }

      // Find the single temperature profile using closestInitialTemperature
      const temperatureProfile = temperatureProfiles.find(
        (profile) => profile.temperature === temperatureFilter.closestInitialTemperature,
      );

      if (!temperatureProfile) {
        throw new Error(
          `No temperature profile found for closestInitialTemperature ${temperatureFilter.closestInitialTemperature}°C. Available profiles: ${temperatureProfiles.map((p) => p.temperature).join(', ')}°C`,
        );
      }

      // Calculate durations for each order based on their item type
      const calculatedDurations = orders.reduce<Record<string, number>>((acc, order) => {
        let duration: number;
        switch (order.itemType) {
          case ItemType.A:
            duration = temperatureProfile.timeA;
            break;
          case ItemType.B:
            duration = temperatureProfile.timeB;
            break;
          case ItemType.C:
            duration = temperatureProfile.timeC;
            break;
          default:
            duration = 0;
        }
        acc[order.itemNumber.toString()] = duration;
        return acc;
      }, {});

      // Also calculate durations for all item types (A, B, C) for future use
      const itemTypeDurations = {
        [ItemType.A]: temperatureProfile.timeA,
        [ItemType.B]: temperatureProfile.timeB,
        [ItemType.C]: temperatureProfile.timeC,
      };

      // TODO: 🔴 STOP HERE !!

      // TODO: REMOVE - DEV ONLY
      // log('__DEV: filters', 'hotpink', filters);

      // ======================================================================== //

      // TODO: const operatingTime = Math.abs(finalTime - initialTime);

      const operatingTime = Math.abs(temperatureFilter.final - temperatureFilter.closestInitialTemperature);

      // Save configuration with calculated durations for both selected orders and all item types
      const config = {
        filters: {
          temperature: {
            initial: temperatureFilter.closestInitialTemperature,
            final: temperatureFilter.final, // Use actual user input, not profile temperature
            duration: Math.max(...Object.values(calculatedDurations)),
          },
        },
        temperatures: {
          default: temperatureProfile.temperature,
          initial: temperatureFilter.closestInitialTemperature,
          final: temperatureFilter.final, // Use actual user input
        },
        durations: {
          ...calculatedDurations, // Individual order durations
          ...itemTypeDurations, // Item type durations (A, B, C)
          default: Math.max(...Object.values(calculatedDurations)),
        },
        selectedOrders: orders.map((order) => order.itemNumber),
      };

      await saveConfig(config);

      // Call onSuccess with the calculated durations map
      options.onSuccess?.(calculatedDurations);
    } catch (error) {
      console.error('Temperature control error:', error);
      options.onError?.(error as Error);
    }
  }, [
    filters,
    temperatureFilter,
    temperatureProfiles, // ✅ Use temperatureProfiles instead of query
    orders,
    saveConfig,
    options.onSuccess,
    options.onError,
  ]);

  return {
    startTemperatureControl,
    isLoading: showLoading,
  };
};
