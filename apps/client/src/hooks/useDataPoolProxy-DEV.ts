import { useMemo } from 'react';
import { useFiltersContext } from 'providers/FiltersProvider/FiltersContext';
import { useFilters } from 'providers/FiltersProvider/useFilters';
import type { DataEntry } from 'types/data.types';
import type { OrderModel } from 'types/models/order.model';
import type { OrderReadableModel } from 'types/models/order-readable.model';

// TODO: ⚠️ *may be needed* for FINAL STEP in FLOW, pathname: /container-type, filterKey: containterType..
// import { generateTemperatureProfiles } from 'utils/temperature-profile-generator';

// If datafiltered.length === 0 when a containerType radio in INITIALLY selected by user,
// BEFORE clicking Next button to navigate to TemperaturePage.tsx

// BUT: 🚨 POSSIBLE HEAVY PERFORMANCE IMPACT... AND TemperaturePage.tsx can probably do this.
// SO: ✅  `temperature` filter, with EMPTY profiles[] array should be fine, and can REMOVE import.

/**
 * 🚨 DATA POOL PROXY HOOK
 *
 * Creates a proxy layer between real dataPool and LayoutUiContext.
 * Ensures buttons are always visible by injecting mock entries when dataFiltered is empty.
 *
 * Key Features:
 * - Non-mutating: Original dataPool stays intact
 * - Reactive: Updates when filters change
 * - Context-aware: Uses real filters for mock generation
 * - Stable for current page: Buttons don't disappear when user changes selection
 */
export const useDataPoolProxy = <T extends DataEntry | OrderModel | OrderReadableModel>(
  dataPool: T[],
): T[] => {
  const { filters } = useFiltersContext();
  const { dataFiltered } = useFilters();

  const proxyDataPool = useMemo(() => {
    // If we have real data, use it as-is
    if (dataFiltered.length > 0) {
      // NOTE: 1
      // log('🚨 DATA POOL PROXY: Using real data, no proxy needed', 'lime', dataPool);
      // return dataPool;

      // NEW: V2
      log('🚨 DATA POOL PROXY: Using real data, no proxy needed', 'lime', dataFiltered);
      return dataFiltered as T[];
    }

    // If no real data, inject mock entries to keep buttons visible
    log('🚨 DATA POOL PROXY: No real data found, injecting mock entries', 'orange');

    // Generate mock entries based on current filter context
    // const mockEntries = generateMockEntries(filters);
    const mockEntries = [];

    // NOTE: V1
    // log('🚨 DATA POOL PROXY: Injected mock entries:', 'grey', mockEntries.length);
    // log('🚨 DATA POOL PROXY: Injected mock entries:', 'yellow', [...dataPool, ...mockEntries]);
    // return [...dataPool, ...mockEntries] as T[];

    // NEW: V2
    log('🚨 DATA POOL PROXY: Injected mock entries:', 'grey', mockEntries.length);
    log('🚨 DATA POOL PROXY: Injected mock entries:', 'yellow', [...dataFiltered, ...mockEntries]);
    return [...dataFiltered, ...mockEntries] as T[];

    // TODO: END >>>
  }, [dataPool, dataFiltered.length, dataFiltered, filters]);

  return proxyDataPool;
};

/**
 * Generate mock entries based on current filter context
 * This ensures mock buttons are contextually relevant
 */
function generateMockEntries(filters: any): any[] {
  const mockEntries: any[] = [];

  // Get current filter values
  const currentMode = filters.mode?.name || '3';
  const currentDrinkType = filters.drinkType?.name || 'cerveza';
  const currentDrinkSubtype = filters.drinkSubtype?.name || null;
  const currentVolume = filters.drinkVolume?.name || '50cl';
  const currentContainerType = filters.containerType?.name || 'botella';

  // Generate mock entries for common options that might be missing
  const commonVolumes = ['25cl', '33cl', '50cl', '75cl', '1L', '1.25L', '1.5L', '2L'];
  const commonContainerTypes = ['plastico', 'vidrio', 'metal'];
  const commonDrinkTypes = ['cerveza', 'vino', 'cava', 'licor', 'zumo', 'refresco', 'agua'];

  // Add mock volume entries if we have drink type but no volumes
  if (filters.drinkType && !filters.drinkVolume) {
    commonVolumes.forEach((volume, index) => {
      mockEntries.push({
        id: `mock-volume-${index}`,
        mode: currentMode,
        drinkType: currentDrinkType,
        drinkSubtype: currentDrinkSubtype,
        volume,
        containerType: currentContainerType,
        // Add other required fields
        modeId: filters.mode?.id || 'mock-mode-id',
        temperatureProfile: 'mock-profile',
        defaultTempConsume: 4,
        defaultTempFreeze: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  // Add mock container type entries if we have volume but no container type
  if (filters.drinkVolume && !filters.containerType) {
    commonContainerTypes.forEach((containerType, index) => {
      mockEntries.push({
        id: `mock-container-${index}`,
        mode: currentMode,
        drinkType: currentDrinkType,
        drinkSubtype: currentDrinkSubtype,
        volume: currentVolume,
        containerType,
        // Add other required fields
        modeId: filters.mode?.id || 'mock-mode-id',
        temperatureProfile: 'mock-profile',
        defaultTempConsume: 4,
        defaultTempFreeze: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  // Add mock drink type entries if we have mode but no drink type
  if (filters.mode && !filters.drinkType) {
    commonDrinkTypes.forEach((drinkType, index) => {
      mockEntries.push({
        id: `mock-drink-${index}`,
        mode: currentMode,
        drinkType,
        drinkSubtype: null,
        volume: currentVolume,
        containerType: currentContainerType,
        // Add other required fields
        modeId: filters.mode?.id || 'mock-mode-id',
        temperatureProfile: 'mock-profile',
        defaultTempConsume: 4,
        defaultTempFreeze: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  return mockEntries;
}
