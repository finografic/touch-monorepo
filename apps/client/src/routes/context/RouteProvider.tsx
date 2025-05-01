import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import React, { type ReactNode, useEffect, useState } from 'react';
import { useRouterLoader } from 'routes/hooks/useRouterLoader';
import { withRouteMetadata } from 'routes/utils/withRouteMetadata';
import { RouteContext } from './RouteContext';
import NotFound from 'pages/NotFound';
import cloneDeep from 'lodash/cloneDeep';
import { ROUTE_CONFIG } from 'routes/routes.config';

interface RouteProviderProps {
  children: ReactNode;
}

export const RouteProvider: React.FC<RouteProviderProps> = ({ children }) => {
  const [routes, setRoutes] = useState<RouteObject[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // NOTE: contains the logic moved out from useRouter(), and now used as route loader method,
  // making it available app-wide.. Requires big REFACTOR !!
  const { routerLoader } = useRouterLoader();

  useEffect(() => {
    try {
      // const appRoutes = getAppRoutes({ routerLoader });
      const appRoutes = cloneDeep([
        {
          id: 'base',
          path: '/',
          loader: routerLoader,
          // element: <LayoutContent />,
          element: <Outlet />,
          children: [{ path: '*', element: <NotFound /> }],
        },
      ]);

      const routesWithMetadata = withRouteMetadata(appRoutes, ROUTE_CONFIG);
      setRoutes(routesWithMetadata);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  return <RouteContext.Provider value={{ routes, isInitialized }}>{children}</RouteContext.Provider>;
};
