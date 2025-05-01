import type { RouteObject } from 'react-router-dom';
import { createContext, useContext } from 'react';
import { useLocation, useMatches } from 'react-router-dom';
import type { RouteConfig } from 'routes/routea.types';

interface RouteMetadataContextValues {
  routes: RouteObject[];
  isInitialized: boolean;
  route?: RouteObject & RouteConfig;
}

export const RouteMetadataContext = createContext<RouteMetadataContextValues>({
  route: undefined,
  routes: [],
  isInitialized: false,
});

/**
 * Hook to access enhanced routes information and metadata.
 * Provides access to all routes and the current route with its metadata.
 */
export const useRouteMetadata = () => {
  const context = useContext(RouteMetadataContext);
  const location = useLocation();
  const matches = useMatches();

  // Get the last match which corresponds to the current route
  const currentMatch = matches[matches.length - 1];

  // Find the corresponding route object from our enhanced routes
  const currentRoute = currentMatch ? context.routes.find((r) => r.id === currentMatch.id) : undefined;

  return {
    ...context,
    route: currentRoute
      ? {
          ...currentRoute,
          pathname: location.pathname,
        }
      : undefined,
  };
};
