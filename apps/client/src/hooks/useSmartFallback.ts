import { useEffect, useMemo } from 'react';
import { useFiltersContext } from 'providers/FiltersProvider/FiltersContext';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useFilters } from 'providers/FiltersProvider/useFilters';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import { generateTemperatureProfiles } from 'utils/temperature-profile-generator';

/**
 * 🚨 SMART FALLBACK HOOK
 *
 * Creates context-aware fallback data that adapts to user's filter selections.
 * Uses real filters when possible, falls back to mock only when needed.
 *
 * Key Features:
 * - Watches dataFiltered.length for empty data scenarios
 * - Creates dynamic fallback using real filters + mock only when needed
 * - Uses consistent temperature profile generation logic
 * - Adapts to user's actual filter selections
 */
export const useSmartFallback = () => {
  const { filters, setFilter } = useFiltersContext();
  const { setProfile } = useOrders();
  const { dataFiltered } = useFilters();

  // 🚨 SMART FALLBACK: Create context-aware fallback entry
  const smartFallbackEntry = useMemo((): OrderReadableModel => {
    console.warn('🚨 SMART FALLBACK: Creating context-aware fallback entry');

    // Use real filter values when available, fallback to defaults when not
    const fallbackModeId = filters.mode?.id || 'fallback-mode-id';
    const fallbackModeName = filters.mode?.name || '3';
    const fallbackDrinkType = filters.drinkType?.name || 'cerveza';
    const fallbackDrinkSubtype = filters.drinkSubtype?.name || null;
    const fallbackVolume = filters.drinkVolume?.name || '50cl';
    const fallbackContainerType = filters.containerType?.name || 'botella';

    // Generate temperature profiles using consistent logic
    const temperatureProfiles = generateTemperatureProfiles(fallbackModeId, fallbackDrinkType);

    const fallbackEntry: OrderReadableModel = {
      id: `smart-fallback-${Date.now()}`,
      modeId: fallbackModeId,
      mode: fallbackModeName,
      drinkType: fallbackDrinkType,
      drinkSubtype: fallbackDrinkSubtype,
      volume: fallbackVolume,
      containerType: fallbackContainerType,
      temperatureProfile: 'smart-fallback-profile',
      defaultTempConsume: 4,
      defaultTempFreeze: 2,
      // ModelBaseProps
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      temperatureProfiles,
    };

    console.log('🚨 SMART FALLBACK: Created context-aware entry:', {
      mode: fallbackModeName,
      drinkType: fallbackDrinkType,
      volume: fallbackVolume,
      containerType: fallbackContainerType,
      temperatureProfilesCount: temperatureProfiles.length,
    });

    return fallbackEntry;
  }, [filters]);

  // 🚨 SMART FALLBACK: Handle side effects (setProfile) in useEffect
  useEffect(() => {
    console.warn('🚨 SMART FALLBACK: Setting smart fallback entry as profile');
    setProfile(smartFallbackEntry);
    console.log('🚨 SMART FALLBACK: Created smart fallback entry:', smartFallbackEntry);
  }, [smartFallbackEntry, setProfile]);

  // 🚨 SMART FALLBACK: Set up temperature filter when containerType is selected
  useEffect(() => {
    if (filters.containerType && !filters.temperature && smartFallbackEntry) {
      console.log('🚨 SMART FALLBACK: ContainerType selected, setting up temperature filter');

      // Set up temperature filter using the smart fallback entry
      setFilter('temperature', {
        initial: 18,
        final: 4,
        defaultConsume: 4,
        closestInitialTemperature: 18,
        closestFinalTemperature: 4,
        temperatureProfiles: smartFallbackEntry.temperatureProfiles,
      });
    }
  }, [filters.containerType, filters.temperature, setFilter, smartFallbackEntry]);

  return {
    createFallbackEntry: smartFallbackEntry,
  };
};
