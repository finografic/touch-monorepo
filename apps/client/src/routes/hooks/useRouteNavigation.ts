import { PATHS, ROUTES_CONFIG } from 'config';
import { useMemo } from 'react';
import { useFilters } from 'providers/FiltersProvider';
import {
  getActualNextPath,
  getActualPreviousPath,
  resolveRouteParameters,
} from 'routes/hooks/useRouteNavigation.utils';
import { useRouteMatching } from 'routes/hooks/useRouteMatching';
import type { OrderFilters } from 'types/filters.types';

/**
 * Hook to get navigation information for the current route.
 * Uses explicit navigation paths from ROUTES_CONFIG instead of dynamic generation.
 * Handles conditional routes based on filter conditions.
 */
export const useRouteNavigation = () => {
  const { matchRoute, currentPathname } = useRouteMatching();
  const { filters } = useFilters();

  return useMemo(() => {
    // Find the current route config using shared matching logic
    const currentRoute = matchRoute(ROUTES_CONFIG, currentPathname);

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
  }, [matchRoute, currentPathname, filters]);
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
