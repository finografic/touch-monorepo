import { useEffect, useMemo } from 'react';
import { useFiltersContext } from 'providers/FiltersProvider/FiltersContext';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import type { OrderReadableModel } from 'types/models/order-readable.model';

/**
 * 🚨 DIRTY FIX HOOK
 *
 * Creates a fallback OrderReadableModel when no data is available.
 * This prevents crashes when filters result in zero data entries.
 *
 * Used by:
 * - TemperaturePage.tsx (when page loads)
 * - useProcessTimesFromTemperatureFilter.ts (when START button clicked)
 */
export const useDirtyFixFallback = () => {
  const { filters, setFilter } = useFiltersContext();
  const { setProfile } = useOrders();

  // 🚨 DIRTY FIX: Create fallback entry data (pure computation)
  const fallbackEntry = useMemo((): OrderReadableModel => {
    const fallbackModeId = filters.mode?.id || 'fallback-mode-id';
    return {
      id: `fallback-${Date.now()}`,
      modeId: fallbackModeId,
      mode: filters.mode?.name || '3',
      drinkType: filters.drinkType?.name || 'cerveza',
      drinkSubtype: filters.drinkSubtype?.name || null,
      volume: filters.drinkVolume?.name || '50cl',
      containerType: filters.containerType?.name || 'botella',
      temperatureProfile: 'fallback-profile',
      defaultTempConsume: 4,
      defaultTempFreeze: 2,
      // ModelBaseProps
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      temperatureProfiles: [
        {
          id: 'fallback-temp-1',
          modeId: fallbackModeId,
          temperature: 18,
          timeA: 0,
          timeB: 0,
          timeC: 0,
        },
        {
          id: 'fallback-temp-2',
          modeId: fallbackModeId,
          temperature: 4,
          timeA: 300,
          timeB: 300,
          timeC: 300,
        },
        {
          id: 'fallback-temp-3',
          modeId: fallbackModeId,
          temperature: 2,
          timeA: 600,
          timeB: 600,
          timeC: 600,
        },
      ],
    };
  }, [filters]);

  // 🚨 DIRTY FIX: Handle side effects (setProfile) in useEffect
  useEffect(() => {
    console.warn('🚨 DIRTY FIX: Setting fallback entry as profile');
    setProfile(fallbackEntry);
    console.log('🚨 DIRTY FIX: Created fallback entry:', fallbackEntry);
  }, [fallbackEntry, setProfile]);

  // 🚨 DIRTY FIX: Set up temperature filter when containerType is selected
  useEffect(() => {
    if (filters.containerType && !filters.temperature && fallbackEntry) {
      console.log('🚨 DIRTY FIX: ContainerType selected, setting up temperature filter');

      // Set up temperature filter using the fallback entry
      setFilter('temperature', {
        initial: 18,
        final: 4,
        defaultConsume: 4,
        closestInitialTemperature: 18,
        closestFinalTemperature: 4,
        temperatureProfiles: fallbackEntry.temperatureProfiles,
      });
    }
  }, [filters.containerType, filters.temperature, setFilter, fallbackEntry]);

  return {
    createFallbackEntry: fallbackEntry,
  };
};
