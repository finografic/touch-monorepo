import { getFiltersByStep, getOrderedFilters, matchesFilters } from './filters.utils';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { DataEntry } from 'types/data.types';
import type { OrderFilters } from 'types/filters.types';
import type { FilterKey } from 'types/orders.types';

/**
 * Interface for filtering results
 */
export interface FilteringResults {
  dataPool: OrderReadableModel[];
  dataFiltered: OrderReadableModel[];
}

/**
 * Configuration for data filtering
 */
export interface FilteringConfig {
  /** Raw data to filter */
  data: OrderReadableModel[];
  /** Current filters state */
  filters: OrderFilters;
  /** Current filter key (route step) */
  filterKey: FilterKey;
  /** Whether to apply containerType temp fix */
  applyContainerTypeFix?: boolean;
}

/**
 * 🚨 DEDICATED DATA FILTERING UTILITY
 *
 * Extracted from useFilters.ts for reusability and testability.
 * Handles generation of dataPool and dataFiltered objects.
 *
 * @param config - Filtering configuration
 * @returns Filtered dataPool and dataFiltered arrays
 */
export const filterData = (config: FilteringConfig): FilteringResults => {
  const { data, filters, filterKey, applyContainerTypeFix = true } = config;

  // SAFEGUARD: ensure data is assignable to DataEntry[] for matchesFilters
  const safeDataForFilter: DataEntry[] = Array.isArray(data) ? (data as unknown as DataEntry[]) : [];

  // For dataFiltered, use ALL filters in ordered format (mode first)
  const allFilters = getOrderedFilters(filters);
  let filtered = safeDataForFilter.filter((entry) =>
    matchesFilters(entry, allFilters),
  ) as unknown as OrderReadableModel[];

  // For dataPool (for filter options), use only filters up to the current step
  let pool = safeDataForFilter;
  if (filterKey) {
    const filtersBeforeCurrent = getFiltersByStep(filters, filterKey, false);
    pool = safeDataForFilter.filter((entry) => matchesFilters(entry, filtersBeforeCurrent));
  }

  // TEMP FIX: If containerType filter is present, only return the first entry
  if (applyContainerTypeFix && filters.containerType) {
    filtered = filtered.length > 0 ? [filtered[0]] : [];
  }

  console.log('%c🚨 useFilters: loaderData ready, filtering data', 'color:lime', {
    filterKey,
    loaderDataLength: data.length,
    poolLength: pool.length,
    filteredLength: filtered.length,
    filtersCount: Object.keys(filters).length,
  });

  return {
    dataPool: pool as unknown as OrderReadableModel[],
    dataFiltered: filtered as unknown as OrderReadableModel[],
  };
};

/**
 * 🧪 TEST DATA GENERATOR
 * Creates mock OrderReadableModel data for testing
 */
export const createMockData = (count: number = 10): OrderReadableModel[] => {
  const drinkTypes = ['cerveza', 'vino', 'cava', 'licor', 'zumo', 'refresco', 'agua'];
  const subtypes = ['rubia', 'negra', 'tinto', 'blanco', 'rosado'];
  const volumes = ['25cl', '33cl', '50cl', '75cl', '1L', '1.25L', '1.5L', '2L'];
  const containerTypes = ['plastico', 'vidrio', 'metal'];

  return Array.from({ length: count }, (_, index) => ({
    id: `mock-${index}`,
    mode: '3',
    drinkType: drinkTypes[index % drinkTypes.length],
    drinkSubtype: subtypes[index % subtypes.length],
    volume: volumes[index % volumes.length],
    containerType: containerTypes[index % containerTypes.length],
    modeId: 'mock-mode-id',
    temperatureProfile: 'mock-profile',
    defaultTempConsume: 4,
    defaultTempFreeze: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
};

/**
 * 🧪 TEST FILTERS GENERATOR
 * Creates mock filter states for testing
 */
export const createMockFilters = (): OrderFilters => ({
  mode: {
    id: 'mode-1',
    name: '3',
  },
  drinkType: {
    id: 'drink-1',
    name: 'vino',
    hasSubtypes: true,
    defaultTempConsume: 15,
  },
  drinkSubtype: {
    id: 'subtype-1',
    name: 'tinto',
    defaultTempConsume: 15,
  },
  drinkVolume: {
    id: 'volume-1',
    name: '75cl',
  },
  containerType: {
    id: 'container-1',
    name: 'vidrio',
  },
});
