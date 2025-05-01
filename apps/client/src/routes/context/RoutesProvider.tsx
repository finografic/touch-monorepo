import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import React, { type ReactNode, useEffect, useMemo, useState } from 'react';
import { useRouterLoader } from 'routes/hooks/useRouterLoader';
import { withRouteMetadata } from 'routes/utils/withRouteMetadata';
import { RoutesContext } from './RoutesContext';
import NotFound from 'pages/NotFound';
import cloneDeep from 'lodash/cloneDeep';
import { ROUTE_CONFIG } from 'routes/routes.config';

interface RoutesProviderProps {
  children: ReactNode;
}

export const RoutesProvider__V1: React.FC<RoutesProviderProps> = ({ children }) => {
  const [routes, setRoutes] = useState<RouteObject[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // NOTE: contains the logic moved out from useRouter(), and now used as route loader method,
  // making it available app-wide.. Requires big REFACTOR !!
  const { routerLoader } = useRouterLoader();

  useEffect(() => {
    try {
      const routesWithMetadata = withRouteMetadata(
        cloneDeep([
          {
            id: 'base',
            path: '/',
            loader: routerLoader,
            element: <Outlet />,
            children: [{ path: '*', element: <NotFound /> }],
          },
        ]),
        ROUTE_CONFIG,
      );
      setRoutes(routesWithMetadata);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  return <RoutesContext.Provider value={{ routes, isInitialized }}>{children}</RoutesContext.Provider>;
};

// ======================================================================== //
// ======================================================================== //

export const RoutesProvider__V2: React.FC<RoutesProviderProps> = ({ children }) => {
  // NOTE: contains the logic moved out from useRouter(), and now used as route loader method,
  // making it available app-wide.. Requires big REFACTOR !!
  const { routerLoader } = useRouterLoader();

  const { routes = [], isInitialized = false } = useMemo(() => {
    return {
      routes: withRouteMetadata(
        cloneDeep([
          {
            id: 'base',
            path: '/',
            loader: routerLoader,
            element: <Outlet />,
            children: [{ path: '*', element: <NotFound /> }],
          },
        ]),
        ROUTE_CONFIG,
      ),
      isInitialized: true,
    };
  }, [ROUTE_CONFIG, routerLoader]);

  return <RoutesContext.Provider value={{ routes, isInitialized }}>{children}</RoutesContext.Provider>;
};
