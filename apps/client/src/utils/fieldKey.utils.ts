import type { FilterKey, NavigationFieldKey } from 'types/orders.types';

/**
 * Type guard to check if a field key is a filter field key
 */
export const isFilterFlowKey = (key: FilterKey): key is FilterKey => {
  return ['drinkType', 'drinkSubtype', 'drinkVolume', 'containerType', 'temperature'].includes(key);
};

/**
 * Type guard to check if a field key is a navigation field key
 */
export const isNavigationFieldKey = (key: FilterKey | NavigationFieldKey): key is NavigationFieldKey => {
  return key === 'main';
};

/**
 * Type guard to check if a field key is a mode field key
 */
export const isModeFieldKey = (key: FilterKey): key is 'mode' => {
  return key === 'mode';
};
