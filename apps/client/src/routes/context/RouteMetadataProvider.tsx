import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import React, { type ReactNode, useMemo } from 'react';
import { useRouterLoader } from 'routes/hooks/useRouterLoader';
import { withRouteMetadata } from 'routes/utils/withRouteMetadata';
import { RouteMetadata } from './RouteMetadataContext';
import NotFound from 'pages/NotFound';
import cloneDeep from 'lodash/cloneDeep';
import { ROUTES_CONFIG } from 'routes/routes.config';

/**
 * Provides enhanced routes with metadata throughout the app.
 * Wraps the router configuration with metadata from ROUTES_CONFIG
 * and makes it available via useRoutesTree hook.
 */

export const RouteMetadataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { routerLoader } = useRouterLoader();

  const routesState = useMemo(() => {
    const baseRoutes: RouteObject[] = [
      {
        id: 'base',
        path: '/',
        loader: routerLoader,
        element: <Outlet />,
        children: [{ path: '*', element: <NotFound /> }],
      },
    ];

    const enhancedRoutes = withRouteMetadata(cloneDeep(baseRoutes), ROUTES_CONFIG);

    return {
      routes: enhancedRoutes,
      isInitialized: true,
    };
  }, [routerLoader]);

  return <RouteMetadata.Provider value={routesState}>{children}</RouteMetadata.Provider>;
};
