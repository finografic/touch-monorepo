import React, { type ReactNode, useMemo } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import NotFound from 'pages/NotFound';

import { useRouterLoader } from 'routes/hooks/useRouterLoader';
import { routes } from 'routes/routes';
import { flatttenChildren } from 'routes/utils/routes.utils.flatten';
import { withRouteMetadata } from 'routes/utils/withRouteMetadata';

import { ROUTES_CONFIG } from 'config/routes';
import { RouteMetadataContext } from './RouteMetadataContext';

interface RouteMetadataProviderProps {
  children: ReactNode;
}
interface RoutesMetadataReturns {
  routes: RouteObject[];
  routesMetadata: RouteObject[];
  isInitialized: boolean;
}

/**
 * Provides enhanced route metadata hook.
 */
export const RouteMetadataProvider: React.FC<RouteMetadataProviderProps> = ({ children }) => {
  const { routerLoader } = useRouterLoader();

  // Memoize routes to prevent recreation on every render
  const memoizedRoutes = React.useMemo(() => routes, []);

  const stateValues = useMemo((): RoutesMetadataReturns => {
    const base: RouteObject[] = [
      {
        id: 'base',
        path: '/',
        loader: routerLoader,
        element: <Outlet />,
        children: [...memoizedRoutes, { id: 'not-found', path: '*', element: <NotFound /> }],
      },
    ];

    // Apply metadata to routes without deep cloning
    const routesWithMetadata = withRouteMetadata(base, ROUTES_CONFIG);

    // Create flattened version for lookup, excluding React elements
    const routesMetadata = flatttenChildren<RouteObject>(routesWithMetadata);

    return {
      isInitialized: true,
      routes: routesWithMetadata,
      routesMetadata,
    };
  }, [memoizedRoutes, routerLoader]);

  return <RouteMetadataContext.Provider value={stateValues}>{children}</RouteMetadataContext.Provider>;
};
