import { useCallback } from 'react';

import { useLocation } from 'react-router-dom';

import type { RouteConfig } from 'routes/routes.types';

/**
 * Shared utility hook for route matching logic.
 * Eliminates duplication between useRouteNavigation and useRouteConfig.
 */
export const useRouteMatching = () => {
  const location = useLocation();

  /**
   * Match a route from a collection of routes against the current pathname.
   * Handles both exact matches and dynamic parameter matches.
   */
  const matchRoute = useCallback((routes: RouteConfig[], pathname: string): RouteConfig | undefined => {
    return routes.find((route) => {
      if (!route.path) return false;

      // Direct match
      if (route.path === pathname) return true;

      // Dynamic parameter match (e.g., /drink-type/:drinkTypeId vs /drink-type/123)
      if (route.path.includes(':')) {
        const routePattern = route.path.replace(/:[^/]+/g, '[^/]+');
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(pathname);
      }

      return false;
    });
  }, []);

  /**
   * Match a route by ID from a collection of routes.
   */
  const matchRouteById = useCallback((routes: RouteConfig[], id: string): RouteConfig | undefined => {
    return routes.find((route) => route.id === id);
  }, []);

  return {
    matchRoute,
    matchRouteById,
    currentPathname: location.pathname,
  };
};
