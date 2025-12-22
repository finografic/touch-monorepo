import { useMemo } from 'react';

import { useFiltersContext } from 'providers/FiltersProvider';
import { useRouteMatching } from 'routes/hooks/useRouteMatching';
import {
  getActualNextPath,
  getActualPreviousPath,
  resolveRouteParameters,
} from 'routes/hooks/useRouteNavigation.utils';

import { ROUTES_CONFIG } from 'config/routes';

/**
 * Hook to get navigation information for the current route.
 * Uses explicit navigation paths from ROUTES_CONFIG instead of dynamic generation.
 * Handles conditional routes based on filter conditions.
 */
export const useRouteNavigation = () => {
  const { matchRoute, currentPathname } = useRouteMatching();
  const { filters } = useFiltersContext();

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

    // Normalize flowStep: return -1 if null or < 0, otherwise return flowStep
    const normalizedFlowStep = flowStep === null || flowStep < 0 ? -1 : flowStep;

    return {
      currentRoute,
      nextPath: actualNextPath,
      previousPath: actualPreviousPath,
      flowStep: normalizedFlowStep,
      isInFlow: flowStep !== undefined && flowStep >= 0,
      isFirstStep: flowStep === 0,
      isLastStep: actualNextPath === null && flowStep !== undefined,
    };
  }, [matchRoute, currentPathname, filters]);
};
