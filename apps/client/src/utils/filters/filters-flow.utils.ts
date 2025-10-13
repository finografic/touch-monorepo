import type { FilterKey } from 'types/orders.types';

/**
 * Defines the order of filter steps in the product flow
 */
export const FILTER_STEP_ORDER: FilterKey[] = [
  'drinkType',
  'drinkSubtype',
  'drinkVolume',
  'containerType',
  'temperature',
];

/**
 * Get the index of a filter step in the flow
 * @param {filterKey} Current filter key
 * @returns Index of the filter step
 */
export const getStepIndexByFilterKey = (filterKey: FilterKey): number => {
  return FILTER_STEP_ORDER.indexOf(filterKey);
};

/**
 * Get all filter keys that come after the current step
 * @param {filterKey} Current filter key
 * @returns Array of filter keys
 */
export const getFiltersToClearAhead = ({ filterKey }: { filterKey: FilterKey }): FilterKey[] => {
  const currentIndex = getStepIndexByFilterKey(filterKey);
  if (currentIndex === -1) return []; // Invalid filterKey

  return FILTER_STEP_ORDER.slice(currentIndex + 1);
};

/**
 * Get the next filter key in the flow [Claude v3.5]
 * @param {filterKey} Current filter key
 * @returns Next filter key or undefined if at the end
 */
export const getNextStepFilterKey = ({ filterKey }: { filterKey: FilterKey }): FilterKey | undefined => {
  const currentIndex = getStepIndexByFilterKey(filterKey);
  if (currentIndex === -1 || currentIndex >= FILTER_STEP_ORDER.length - 1) {
    return undefined; // Invalid filterKey or at the end
  }

  return FILTER_STEP_ORDER[currentIndex + 1];
};

/**
 * Get the previous filter key in the flow [Claude v3.5]
 * @param {filterKey} Current filter key
 * @returns Previous filter key or undefined if at the start
 */
export const getPrevStepFilterKey = ({ filterKey }: { filterKey: FilterKey }): FilterKey | undefined => {
  const currentIndex = getStepIndexByFilterKey(filterKey);
  if (currentIndex === -1 || currentIndex <= 0) {
    return undefined; // Invalid filterKey or at the start
  }

  return FILTER_STEP_ORDER[currentIndex - 1];
};
