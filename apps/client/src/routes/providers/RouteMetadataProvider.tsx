import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import React, { type ReactNode, useMemo } from 'react';
import { useRouterLoader } from 'routes/hooks/useRouterLoader';
import { withRouteMetadata } from 'routes/utils/withRouteMetadata';
import { RouteMetadataContext } from './RouteMetadataContext';
import NotFound from 'pages/NotFound';
import { ROUTES_CONFIG } from 'routes/routes.config';
import { routes } from 'routes/routes';
import { flatttenChildren } from 'routes/utils/routes.utils.flatten';

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

  const stateValues = useMemo((): RoutesMetadataReturns => {
    const base: RouteObject[] = [
      {
        id: 'base',
        path: '/',
        loader: routerLoader,
        element: <Outlet />,
        children: [...routes, { id: 'not-found', path: '*', element: <NotFound /> }],
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
  }, [routes, routerLoader]);

  return <RouteMetadataContext.Provider value={stateValues}>{children}</RouteMetadataContext.Provider>;
};
