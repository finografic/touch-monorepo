import { useLocation } from 'react-router-dom';
import { ROUTES_CONFIG } from 'routes/routes.config';
import { PATHS } from 'routes/routes.config';
import { useMemo } from 'react';
import { useFilters } from 'providers/FiltersProvider';

/**
 * Hook to get navigation information for the current route.
 * Uses explicit navigation paths from ROUTES_CONFIG instead of dynamic generation.
 * Handles conditional routes based on filter conditions.
 */
export const useRouteNavigation = () => {
  const location = useLocation();
  const { filters } = useFilters();

  return useMemo(() => {
    // Find the current route config - handle dynamic parameters
    const currentRoute = ROUTES_CONFIG.find((route) => {
      if (!route.path) return false;

      // Direct match
      if (route.path === location.pathname) return true;

      // Dynamic parameter match (e.g., /drink-type/:drinkTypeId vs /drink-type/123)
      if (route.path.includes(':')) {
        const routePattern = route.path.replace(/:[^/]+/g, '[^/]+');
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(location.pathname);
      }

      return false;
    });

    if (!currentRoute?.navigation) {
      return {
        currentRoute: null,
        nextPath: null,
        previousPath: null,
        flowStep: null,
        isInFlow: false,
        isFirstStep: false,
        isLastStep: false,
      };
    }

    const { next, previous, flowStep } = currentRoute.navigation;

    // Calculate actual next/previous paths considering conditional routes
    const actualNextPath = getActualNextPath(next, filters);
    const actualPreviousPath = getActualPreviousPath(previous, filters);

    return {
      currentRoute,
      nextPath: actualNextPath,
      previousPath: actualPreviousPath,
      flowStep: flowStep ?? null,
      isInFlow: flowStep !== undefined && flowStep >= 0,
      isFirstStep: flowStep === 0,
      isLastStep: actualNextPath === null && flowStep !== undefined,
    };
  }, [location.pathname, filters]);
};

/**
 * Get the actual next path, handling all conditional logic through dynamic resolution
 * and replacing dynamic route parameters with actual values
 */
const getActualNextPath = (nextPath: string | undefined, filters: any): string | null => {
  if (!nextPath) return null;

  // Handle conditional route skipping based on hasSubtypes
  let actualNextPath = nextPath;
  if (nextPath === PATHS.drinkSubtype && filters.drinkType?.hasSubtypes === false) {
    // Skip drinkSubtype, go directly to drinkVolume
    return getActualNextPath(PATHS.drinkVolume, filters);
  }

  // Replace dynamic route parameters with actual values
  const resolvedPath = resolveRouteParameters(actualNextPath, filters);

  return resolvedPath;
};

/**
 * Get the actual previous path, handling all conditional logic through dynamic resolution
 * and replacing dynamic route parameters with actual values
 */
const getActualPreviousPath = (previousPath: string | undefined, filters: any): string | null => {
  if (!previousPath) return null;

  // Handle conditional route skipping based on hasSubtypes
  let actualPreviousPath = previousPath;
  if (previousPath === PATHS.drinkSubtype && filters.drinkType?.hasSubtypes === false) {
    // Skip drinkSubtype, go directly to drinkType
    return getActualPreviousPath(PATHS.drinkType, filters);
  }

  // Replace dynamic route parameters with actual values
  const resolvedPath = resolveRouteParameters(actualPreviousPath, filters);

  return resolvedPath;
};

/**
 * Replace dynamic route parameters with actual values from filters
 */
const resolveRouteParameters = (path: string, filters: any): string => {
  // Handle drinkSubtype route parameter
  if (path.includes(':drinkTypeId') && filters.drinkType?.id) {
    const resolvedPath = path.replace(':drinkTypeId', filters.drinkType.id);
    return resolvedPath;
  }

  return path;
};

/**
 * Hook to get all flow paths in order.
 * Returns the paths that are part of the main flow (flowStep >= 0).
 * Conditional route skipping is handled by the navigation functions.
 * Resolves dynamic route parameters with actual values.
 */
export const useFlowPaths = () => {
  const { filters } = useFilters();

  return useMemo(() => {
    return ROUTES_CONFIG.filter(
      (route) => route.navigation?.flowStep !== undefined && route.navigation.flowStep >= 0,
    )
      .sort((a, b) => (a.navigation?.flowStep ?? 0) - (b.navigation?.flowStep ?? 0))
      .map((route) => {
        // Resolve dynamic route parameters
        return resolveRouteParameters(route.path || '', filters);
      })
      .filter((path): path is string => path !== undefined);
  }, [filters]);
};

/**
 * Hook to get the current flow step index.
 * Returns the index of the current route in the flow sequence.
 */
export const useCurrentFlowStep = () => {
  const { flowStep } = useRouteNavigation();
  const flowPaths = useFlowPaths();

  return useMemo(() => {
    if (flowStep === null || flowStep < 0) {
      return -1; // Not in flow
    }
    return flowStep;
  }, [flowStep]);
};
