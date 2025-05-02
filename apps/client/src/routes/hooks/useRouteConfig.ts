import { useLocation, useMatches } from 'react-router-dom';
import { useRouteMetadata } from 'routes/providers/RouteMetadataContext';
import type { RouteConfig } from 'routes/routes.types';

export const useRouteConfig = (): RouteConfig | undefined => {
  const { routes } = useRouteMetadata();
  const location = useLocation();
  const matches = useMatches();

  // Get the last match which corresponds to the current route
  const currentMatch = matches[matches.length - 1];

  // Find the corresponding route object from our enhanced routes
  const currentRoute = currentMatch ? routes.find((r) => r.id === currentMatch.id) : undefined;

  return currentRoute
    ? ({
        ...currentRoute,
        pathname: location.pathname,
      } as RouteConfig)
    : undefined;
};
