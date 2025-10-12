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
 */
export const getFilterStepIndex = (filterKey: FilterKey): number => {
  return FILTER_STEP_ORDER.indexOf(filterKey);
};

/**
 * Get all filter keys that come after the current step
 * These should be cleared when the current step selection changes
 */
export const getFiltersToClearAhead = (currentFieldKey: FilterKey): FilterKey[] => {
  const currentIndex = getFilterStepIndex(currentFieldKey);
  if (currentIndex === -1) return []; // Invalid filterKey

  return FILTER_STEP_ORDER.slice(currentIndex + 1);
};
