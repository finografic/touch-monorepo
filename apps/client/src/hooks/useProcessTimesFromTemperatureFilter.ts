import { useCallback, useDeferredValue, useEffect, useState } from 'react';

import type { SlotMeta } from 'pages/MainPage/MainPage.types';
import { useFiltersContext } from 'providers/FiltersProvider';
import { useFilters } from 'providers/FiltersProvider/useFilters';
import { useOrders } from 'providers/OrdersProvider';

import { SlotType } from 'types/orders.types';

import { useConfigStorage } from './useConfigStorage';
import { useSmartFallback } from './useSmartFallback';

interface UseTemperatureControlOptions {
  onSuccess?: (durations: Record<string, number>) => void;
  onError?: (error: Error) => void;
  selectedSlots?: SlotMeta[];
}

export const useProcessTimesFromTemperatureFilter = (options: UseTemperatureControlOptions = {}) => {
  const [showLoading, setShowLoading] = useState(false);
  const { orders, profile } = useOrders();
  const { filters } = useFiltersContext();
  const { filterKey, dataFiltered } = useFilters();
  const { saveConfig } = useConfigStorage();
  const { createFallbackEntry } = useSmartFallback();

  const temperatureFilter = useDeferredValue(filters.temperature);
  const temperatureProfiles = temperatureFilter?.temperatureProfiles || [];

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
      // 🚨 SMART FALLBACK: Use shared smart fallback entry if dataFiltered is empty
      if (dataFiltered.length === 0) {
        console.warn('🚨 SMART FALLBACK: No filtered data found, using shared smart fallback entry');
        // The createFallbackEntry hook handles setting profile (temperature filter set in TemperaturePage)
        if (['containerType', 'temperature'].includes(filterKey)) {
          log('🚧 FALLBACK TEMPTERATURE ENTRY', 'orange', createFallbackEntry);
        }
      }

      if (!temperatureFilter?.initial || !temperatureFilter?.final) {
        throw new Error('Initial and final temperatures must be set');
      }

      if (!temperatureFilter?.closestInitialTemperature || !temperatureFilter?.closestFinalTemperature) {
        throw new Error('Closest initial and final temperatures must be calculated');
      }

      // ✅ Get temperature profiles from FiltersContext
      if (temperatureProfiles.length === 0) {
        throw new Error('Temperature profiles not available');
      }

      // 🚧 CLOSEST temperature profiles
      const initialProfile = temperatureProfiles.find(
        (profile) => profile.temperature === temperatureFilter.closestInitialTemperature,
      );
      const finalProfile = temperatureProfiles.find(
        (profile) => profile.temperature === temperatureFilter.closestFinalTemperature,
      );

      if (!initialProfile) {
        throw new Error(
          `No temperature profile found for closestInitialTemperature ${temperatureFilter.closestInitialTemperature}°C. Available profiles: ${temperatureProfiles.map((p) => p.temperature).join(', ')}°C`,
        );
      }

      if (!finalProfile) {
        throw new Error(
          `No temperature profile found for closestFinalTemperature ${temperatureFilter.closestFinalTemperature}°C. Available profiles: ${temperatureProfiles.map((p) => p.temperature).join(', ')}°C`,
        );
      }

      // calculate durations for all item types (A, B, C) for future use
      const slotTypeDurations = {
        [SlotType.A]: Math.abs(finalProfile.timeA - initialProfile.timeA),
        [SlotType.B]: Math.abs(finalProfile.timeB - initialProfile.timeB),
        [SlotType.C]: Math.abs(finalProfile.timeC - initialProfile.timeC),
      };

      const calculatedDurations = orders.reduce<Record<string, number>>((acc, order) => {
        acc[order.slotNumber.toString()] = slotTypeDurations[order.slotType] || 0;
        return acc;
      }, {});

      // configuration with calculated durations
      const config = {
        filters: {
          temperature: {
            initial: temperatureFilter.closestInitialTemperature,
            final: temperatureFilter.final, // user input
            duration: Math.max(...Object.values(calculatedDurations)),
          },
        },
        temperatures: {
          default: initialProfile.temperature,
          initial: temperatureFilter.closestInitialTemperature,
          final: temperatureFilter.final, // user input
        },
        durations: {
          ...slotTypeDurations,
          default: Math.max(...Object.values(calculatedDurations)),
        },
      };

      await saveConfig(config);

      options.onSuccess?.(calculatedDurations);
    } catch (error) {
      console.error('Temperature control error:', error);
      options.onError?.(error as Error);
    }
  }, [
    temperatureFilter,
    temperatureProfiles,
    orders,
    saveConfig,
    options.onSuccess,
    options.onError,
    dataFiltered,
    filters,
    createFallbackEntry,
  ]);

  return {
    startTemperatureControl,
    isLoading: showLoading,
  };
};
