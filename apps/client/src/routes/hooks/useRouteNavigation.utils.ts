import { useLocation } from 'react-router-dom';
import { PATHS, ROUTES_CONFIG } from 'routes/routes.config';
import { useMemo } from 'react';
import { useFilters } from 'providers/FiltersProvider';

/**
 * Replace dynamic route parameters with actual values from filters
 */
export const resolveRouteParameters = (path: string, filters: any): string => {
  // Handle drinkSubtype route parameter
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
export const getActualPreviousPath = (previousPath: string | undefined, filters: any): string | null => {
  if (!previousPath) return null;

  // Handle conditional route skipping based on hasSubtypes
  const actualPreviousPath = previousPath;
  if (previousPath === PATHS.drinkSubtype && filters.drinkType?.hasSubtypes === false) {
    // Skip drinkSubtype, go directly to drinkType
    return getActualPreviousPath(PATHS.drinkType, filters);
  }

  // Replace dynamic route parameters with actual values
  const resolvedPath = resolveRouteParameters(actualPreviousPath, filters);

  return resolvedPath;
};

/**
 * Get the actual next path, handling all conditional logic through dynamic resolution
 * and replacing dynamic route parameters with actual values
 */
export const getActualNextPath = (nextPath: string | undefined, filters: any): string | null => {
  if (!nextPath) return null;

  // Handle conditional route skipping based on hasSubtypes
  const actualNextPath = nextPath;
  if (nextPath === PATHS.drinkSubtype && filters.drinkType?.hasSubtypes === false) {
    // Skip drinkSubtype, go directly to drinkVolume
    return getActualNextPath(PATHS.drinkVolume, filters);
  }

  // Replace dynamic route parameters with actual values
  const resolvedPath = resolveRouteParameters(actualNextPath, filters);

  return resolvedPath;
};
