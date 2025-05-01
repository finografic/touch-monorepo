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

interface RouteMetadataProviderProps {
  children: ReactNode;
}

/**
 * Provides enhanced routes with metadata throughout the app.
 * Wraps the router configuration with metadata from ROUTES_CONFIG
 * and makes it available via useRouteMetadata hook.
 */
export const RouteMetadataProvider: React.FC<RouteMetadataProviderProps> = ({ children }) => {
  const { routerLoader } = useRouterLoader();

  const routesState = useMemo(() => {
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

    return {
      routes: enhancedRoutes,
      isInitialized: true,
    };
  }, [routerLoader]);

  return <RouteMetadataContext.Provider value={routesState}>{children}</RouteMetadataContext.Provider>;
};
