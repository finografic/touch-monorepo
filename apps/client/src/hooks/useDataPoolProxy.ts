import { useMemo } from 'react';
import { useFiltersContext } from 'providers/FiltersProvider/FiltersContext';
import { useFilters } from 'providers/FiltersProvider/useFilters';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { OrderFilters } from 'types/filters.types';
import type { FilterKey } from 'types/orders.types';

// TODO: ⚠️ *may be needed* for FINAL STEP in FLOW, pathname: /container-type, filterApiKey: containterType..
// import { generateTemperatureProfiles } from 'utils/temperature-profile-generator';

// If datafiltered.length === 0 when a containerType radio in INITIALLY selected by user,
// BEFORE clicking Next button to navigate to TemperaturePage.tsx

// BUT: 🚨 POSSIBLE HEAVY PERFORMANCE IMPACT... AND TemperaturePage.tsx can probably do this.
// SO:  ✅ `temperature` filter, with EMPTY profiles[] array should be fine, and can REMOVE import.

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
 * - NOTE: Generic typing <T extends DataEntry | OrderModel | OrderReadableModel> removed for simplicity
 */
export const useDataPoolProxy = ({
  dataPool,
}: {
  dataPool: OrderReadableModel[];
}): { dataPoolProxy: OrderReadableModel[] } => {
  const { filters } = useFiltersContext();
  const { dataFiltered, filterKey } = useFilters();

  // Default: return original data (real data from db)
  // console.log('%c🚨>> filterKey:', 'color:cyan', filterKey);

  if (filterKey in filters) {
    console.log('%c🚨>> dataFiltered:', 'color:grey', dataPool);
    console.log('%c🚨>> filterKey in filters:', 'color:lime', filterKey);
  }

  const dataPoolProxy = useMemo((): OrderReadableModel[] => {
    // Edge case: If user clicks NEXT with current selection, next page will be EMPTY
    if (dataFiltered.length === 0) {
      const mockEntries = generateMockEntries(filters);
      console.log('%c🚨 DATA POOL PROXY: No real data found, injecting mock entries', 'color:orange', [
        ...dataPool,
        ...mockEntries,
      ]);
      console.log('%c🚨 DATA POOL PROXY: Injected mock entries:', 'color:grey', mockEntries.length);

      return [...dataPool, ...mockEntries];
    }

    // Default: return original data (real data from db)
    console.log('%c🚨 DATA POOL PROXY: Using real data, no proxy needed', 'color:lime', dataFiltered);

    return dataFiltered;
  }, [dataPool, dataFiltered, filters]);

  return { dataPoolProxy };
};

/**
 * Generate mock entries based on current filter context
 * This ensures mock buttons are contextually relevant
 */
function generateMockEntries(filters: OrderFilters): OrderReadableModel[] {
  const mockEntries: OrderReadableModel[] = [];

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
