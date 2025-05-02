import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import React, { type ReactNode, useMemo } from 'react';
import { useRouterLoader } from 'routes/hooks/useRouterLoader';
import { withRouteMetadata } from 'routes/utils/withRouteMetadata';
import { RouteMetadataContext } from './RouteMetadataContext';
import NotFound from 'pages/NotFound';
import cloneDeep from 'lodash/cloneDeep';
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
 * Provides enhanced routes with metadata throughout the app.
 * Wraps the router configuration with metadata from ROUTES_CONFIG
 * and makes it available via useRouteMetadata hook.
 */
export const RouteMetadataProvider: React.FC<RouteMetadataProviderProps> = ({ children }) => {
  const { routerLoader } = useRouterLoader();

  const routesState = useMemo((): RoutesMetadataReturns => {
    const base: RouteObject[] = [
      {
        id: 'base',
        path: '/',
        loader: routerLoader,
        element: <Outlet />,
        children: [...routes, { id: 'not-found', path: '*', element: <NotFound /> }],
      },
    ];

    // Enhance routes with metadata
    const enhancedRoutes = withRouteMetadata(cloneDeep(base), ROUTES_CONFIG);
    const routesMetadata = flatttenChildren<RouteObject>(cloneDeep(enhancedRoutes));

    log('ROUTES!!', 'lime', enhancedRoutes);

    return {
      routes: enhancedRoutes,
      routesMetadata,
      isInitialized: true,
    };
  }, [routerLoader]);

  return <RouteMetadataContext.Provider value={routesState}>{children}</RouteMetadataContext.Provider>;
};
