import type { DataEntry } from 'types/data.types';
import type { OrderFieldKey } from 'types/orders.types';
import type { OrderFilters } from 'types/filters.types';
import { OrderFieldKeys } from 'constants/app.config';
import { FILTER_ORDER } from 'constants/filters.constants';

/**
 * Reduces filters to find the most specific/dominant value for a given property.
 * Later filters (e.g. drinkSubtype) take precedence over earlier ones (e.g. drinkType).
 * @param params Object containing filters and the property to reduce by
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
  values[OrderFieldKeys.drinkType] = Array.from(
    new Set(data.map((d) => d.drinkType).filter((v): v is string => typeof v === 'string')),
  );
  values[OrderFieldKeys.drinkSubtype] = Array.from(
    new Set(data.map((d) => d.drinkSubtype).filter((v): v is string => typeof v === 'string')),
  );
  values[OrderFieldKeys.drinkVolume] = Array.from(
    new Set(data.map((d) => d.volume).filter((v): v is string => typeof v === 'string')),
  );
  values[OrderFieldKeys.containerType] = Array.from(
    new Set(data.map((d) => d.containerType).filter((v): v is string => typeof v === 'string')),
  );
  return values;
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

    // Use lookup object for comparisons if available
    if (value.lookup) {
      return Object.entries(value.lookup).every(([lookupKey, lookupValue]) => {
        return entry[lookupKey as keyof DataEntry] === lookupValue;
      });
    }

    // Fallback to direct field comparisons for backward compatibility
    switch (key as OrderFieldKey) {
      case OrderFieldKeys.drinkType:
        return entry.drinkType === value.name;
      case OrderFieldKeys.drinkSubtype:
        return entry.drinkSubtype === value.name;
      case OrderFieldKeys.drinkVolume:
        return entry.volume === value.name;
      case OrderFieldKeys.containerType:
        return entry.containerType === value.name;
      case OrderFieldKeys.temperature:
        if (value.initial !== undefined && value.final !== undefined) {
          return (
            (!entry.initialTemperature || entry.initialTemperature === value.initial) &&
            (!entry.finalTemperature || entry.finalTemperature === value.final)
          );
        }
        return true;
      default:
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
  currentFieldKey: OrderFieldKey,
  inclusive: boolean,
): [string, any][] => {
  const currentStepIndex = FILTER_ORDER.indexOf(currentFieldKey);
  if (currentStepIndex === -1) return [];

  return Object.entries(filters).filter(([key]) => {
    const filterIndex = FILTER_ORDER.indexOf(key as OrderFieldKey);
    return (
      filterIndex !== -1 && (inclusive ? filterIndex <= currentStepIndex : filterIndex < currentStepIndex)
    );
  });
};
