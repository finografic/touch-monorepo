import type { DataEntry } from 'types/data.types';
import type { FilterKey } from 'types/orders.types';
import type { OrderFilters } from 'types/filters.types';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import { ROUTE_FILTER_KEYS, SLOT_FILTERS } from 'config/app';

/**
 * Reduces filters to find the most specific/dominant value for a given property.
 * Later filters (e.g. drinkSubtype) take precedence over earlier ones (e.g. drinkType).
 * @param params Object containing filters and the property to reduce by
 * @param params.propKey The property key to reduce by
 * @param params.filters The filters object to reduce
 * @returns The most specific value found, or empty string if not found
 */
export const reduceFilterProperty = <T>({
  propKey,
  filters,
}: {
  propKey: keyof T;
  filters: OrderFilters;
}): T[keyof T] | '' => {
  return Object.values(filters).reduce<T[keyof T] | ''>(
    (acc, value) => (value?.[propKey as keyof typeof value] as T[keyof T]) ?? acc,
    '',
  );
};

/**
 * Get unique values for each filter key from a dataset
 * @param data Array of data entries to extract unique values from
 * @returns Record of unique values for each filter key
 */
export const getUniqueFilterValues = (data: DataEntry[]): Record<string, string[]> => {
  const values: Record<string, string[]> = {};
  values[ROUTE_FILTER_KEYS.drinkType] = Array.from(
    new Set(data.map((d) => d.drinkType).filter((v): v is string => typeof v === 'string')),
  );
  values[ROUTE_FILTER_KEYS.drinkSubtype] = Array.from(
    new Set(data.map((d) => d.drinkSubtype).filter((v): v is string => typeof v === 'string')),
  );
  values[ROUTE_FILTER_KEYS.drinkVolume] = Array.from(
    new Set(data.map((d) => d.volume).filter((v): v is string => typeof v === 'string')),
  );
  values[ROUTE_FILTER_KEYS.containerType] = Array.from(
    new Set(data.map((d) => d.containerType).filter((v): v is string => typeof v === 'string')),
  );
  return values;
};

/**
 * Order filters with mode first, then by SLOT_FILTERS order
 * @param filters Current filters object
 * @returns Ordered array of [key, value] pairs
 */
export const getOrderedFilters = (filters: OrderFilters): [string, any][] => {
  const orderedEntries: [string, any][] = [];

  // Add mode first if present
  if (filters.mode) {
    orderedEntries.push(['mode', filters.mode]);
  }

  // Add other filters in SLOT_FILTERS order
  for (const filterApiKey of SLOT_FILTERS) {
    if (filters[filterApiKey as keyof OrderFilters]) {
      orderedEntries.push([filterApiKey, filters[filterApiKey as keyof OrderFilters]]);
    }
  }

  return orderedEntries;
};

/**
 * Check if a data entry matches the given filters
 * @param entry Data entry to check
 * @param activeFilters Array of [key, value] pairs representing active filters
 * @returns Whether the entry matches all active filters
 */
export const matchesFilters = (entry: DataEntry, activeFilters: [string, any][]): boolean => {
  return activeFilters.every(([key, value]) => {
    if (!value) return true;

    // NEW: Direct field comparisons for orders_readable data
    // The entry now has direct name values (e.g., entry.drinkType = "cerveza")
    // and the filter value has a name property (e.g., value.name = "cerveza")
    switch (key as FilterKey) {
      // case ROUTE_FILTER_KEYS.main:
      //   return entry.main === value.name;
      case ROUTE_FILTER_KEYS.mode:
        return entry.mode === value.name;
      case ROUTE_FILTER_KEYS.drinkType:
        return entry.drinkType === value.name;
      case ROUTE_FILTER_KEYS.drinkSubtype:
        return entry.drinkSubtype === value.name;
      case ROUTE_FILTER_KEYS.drinkVolume:
        return entry.volume === value.name;
      case ROUTE_FILTER_KEYS.containerType:
        return entry.containerType === value.name;
      case ROUTE_FILTER_KEYS.temperature:
        if (value.initial !== undefined && value.final !== undefined) {
          return (
            (!entry.initialTemperature || entry.initialTemperature === value.initial) &&
            (!entry.finalTemperature || entry.finalTemperature === value.final)
          );
        }
        return true;
      default:
        // Handle non-FilterKey filters (like 'mode')
        if (key === 'mode') {
          return entry.mode === value.name;
        }
        return true;
    }
  });
};

/**
 * Get filters that are before a certain step in the filter order
 * @param filters Current filters object
 * @param currentFieldKey Current field key to compare against
 * @param inclusive Whether to include the current field key
 * @returns Array of [key, value] pairs for matching filters
 */
export const getFiltersByStep = (
  filters: OrderFilters,
  currentFieldKey: FilterKey,
  inclusive: boolean,
): [string, any][] => {
  const currentStepIndex = SLOT_FILTERS.indexOf(currentFieldKey);
  if (currentStepIndex === -1) return [];

  return Object.entries(filters).filter(([key]) => {
    const filterIndex = SLOT_FILTERS.indexOf(key as FilterKey);
    return (
      filterIndex !== -1 && (inclusive ? filterIndex <= currentStepIndex : filterIndex < currentStepIndex)
    );
  });
};

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
 * Dedicated data filtering utility
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

  // 🚨 TEMPORARILY DISABLED: For dataPool (for filter options), use only filters up to the current step
  // let pool = safeDataForFilter;
  // if (filterKey) {
  //   const filtersBeforeCurrent = getFiltersByStep(filters, filterKey, false);
  //   pool = safeDataForFilter.filter((entry) => matchesFilters(entry, filtersBeforeCurrent));
  // }

  // 🚨 TEMPORARY: Show ALL options regardless of filters
  let pool = safeDataForFilter;

  // TEMP FIX: If containerType filter is present, only return the first entry
  if (applyContainerTypeFix && filters.containerType) {
    filtered = filtered.length > 0 ? [filtered[0]] : [];
  }

  return {
    dataPool: pool as unknown as OrderReadableModel[],
    dataFiltered: filtered as unknown as OrderReadableModel[],
  };
};
