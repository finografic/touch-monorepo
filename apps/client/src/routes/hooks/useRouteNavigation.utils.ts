import type { OrderFilters } from 'types/filters.types';
import { PATHS } from 'config/routes';

/**
 * Replace dynamic route parameters with actual values from filters
 */
export const resolveRouteParameters = (path: string, filters: OrderFilters): string => {
  if (path.includes(':drinkTypeId') && filters.drinkType?.id) {
    const resolvedPath = path.replace(':drinkTypeId', filters.drinkType.id);
    return resolvedPath;
  }

  return path;
};

/**
 * Get the actual previous path, handling all conditional logic through dynamic resolution
 * and replacing dynamic route parameters with actual values
 */
export const getActualPreviousPath = (
  previousPath: string | undefined,
  filters: OrderFilters,
): string | null => {
  if (!previousPath) return null;

  // Handle conditional route skipping based on hasSubtypes
  if (previousPath === PATHS.drinkSubtype && filters.drinkType?.hasSubtypes === false) {
    // Skip drinkSubtype, go directly to drinkType
    return getActualPreviousPath(PATHS.drinkType, filters);
  }

  // If we're resolving drinkVolume and came from skipping drinkSubtype,
  // go back to drinkType (skip drinkSubtype)
  if (previousPath === PATHS.drinkVolume && filters.drinkType?.hasSubtypes === false) {
    // Skip drinkSubtype, go directly to drinkType
    return getActualPreviousPath(PATHS.drinkType, filters);
  }

  // Replace dynamic route parameters with actual values
  const resolvedPath = resolveRouteParameters(previousPath, filters);

  return resolvedPath;
};

/**
 * Get the actual next path, handling all conditional logic through dynamic resolution
 * and replacing dynamic route parameters with actual values
 */
export const getActualNextPath = (nextPath: string | undefined, filters: OrderFilters): string | null => {
  if (!nextPath) return null;

  // Handle conditional route skipping based on hasSubtypes
  if (nextPath === PATHS.drinkSubtype && filters.drinkType?.hasSubtypes === false) {
    // Skip drinkSubtype, go directly to drinkVolume
    // Then continue resolving: drinkVolume -> containerType
    return getActualNextPath(PATHS.drinkVolume, filters);
  }

  // If we're resolving drinkVolume and came from skipping drinkSubtype,
  // continue to containerType (the next step after drinkVolume)
  if (nextPath === PATHS.drinkVolume) {
    // Check if we should continue resolving (only if we skipped drinkSubtype)
    // This happens when filters.drinkType exists but hasSubtypes is false
    if (filters.drinkType && filters.drinkType.hasSubtypes === false) {
      // Continue to containerType (next step after drinkVolume)
      return getActualNextPath(PATHS.containerType, filters);
    }
  }

  // Replace dynamic route parameters with actual values
  const resolvedPath = resolveRouteParameters(nextPath, filters);

  return resolvedPath;
};
