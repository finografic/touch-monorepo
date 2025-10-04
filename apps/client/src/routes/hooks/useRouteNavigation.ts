import { useLocation } from 'react-router-dom';
import { PATHS, ROUTES_CONFIG } from 'routes/routes.config';
import { useMemo } from 'react';
import { useFilters } from 'providers/FiltersProvider';
import {
  getActualNextPath,
  getActualPreviousPath,
  resolveRouteParameters,
} from 'routes/hooks/useRouteNavigation.utils';
import type { OrderFilters } from 'types/filters.types';

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
