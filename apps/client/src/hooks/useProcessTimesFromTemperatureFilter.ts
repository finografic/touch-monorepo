import { useCallback, useDeferredValue, useEffect, useState } from 'react';
import { useConfigStorage } from './useConfigStorage';
import { useOrders } from 'providers/OrdersProvider';
import { SlotType } from 'types/orders.types';
import { useFiltersContext } from 'providers/FiltersProvider';
import { useFilters } from 'providers/FiltersProvider/useFilters';
import type { SlotMeta } from 'pages/MainPage/MainPage.types';
import createCuid from '@bugsnag/cuid';
import { useDirtyFixFallback } from './useDirtyFixFallback';

interface UseTemperatureControlOptions {
  onSuccess?: (durations: Record<string, number>) => void;
  onError?: (error: Error) => void;
  selectedSlots?: SlotMeta[]; // Add selected orders parameter
}

export const useProcessTimesFromTemperatureFilter = (options: UseTemperatureControlOptions = {}) => {
  const [showLoading, setShowLoading] = useState(false);
  const { orders, profile } = useOrders();
  const { filters } = useFiltersContext();
  const { dataFiltered } = useFilters();
  const { saveConfig } = useConfigStorage();
  const { createFallbackEntry } = useDirtyFixFallback();

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
      // 🚨 DIRTY FIX: Use shared fallback entry if dataFiltered is empty
      if (dataFiltered.length === 0) {
        console.warn('🚨 DIRTY FIX: No filtered data found, using shared fallback entry');
        // The createFallbackEntry hook handles setting profile (temperature filter set in TemperaturePage)
        createFallbackEntry;
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

      // Find both temperature profiles using closest temperatures
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

      // Calculate operating time for each item type
      const operatingTimeA = Math.abs(finalProfile.timeA - initialProfile.timeA);
      const operatingTimeB = Math.abs(finalProfile.timeB - initialProfile.timeB);
      const operatingTimeC = Math.abs(finalProfile.timeC - initialProfile.timeC);

      // Calculate durations for each order based on their item type
      const operatingTimes = {
        [SlotType.A]: operatingTimeA,
        [SlotType.B]: operatingTimeB,
        [SlotType.C]: operatingTimeC,
      };

      const calculatedDurations = orders.reduce<Record<string, number>>((acc, order) => {
        acc[order.slotNumber.toString()] = operatingTimes[order.slotType] || 0;
        return acc;
      }, {});

      // Also calculate durations for all item types (A, B, C) for future use
      const slotTypeDurations = operatingTimes;

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
          default: initialProfile.temperature,
          initial: temperatureFilter.closestInitialTemperature,
          final: temperatureFilter.final, // Use actual user input
        },
        durations: {
          ...slotTypeDurations, // Only item type durations (A, B, C)
          default: Math.max(...Object.values(calculatedDurations)),
        },
      };

      await saveConfig(config);

      // Call onSuccess with the calculated durations map
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
