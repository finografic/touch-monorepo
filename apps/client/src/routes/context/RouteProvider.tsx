import type { RouteObject } from 'react-router-dom';
import React, { type ReactNode, useEffect, useState } from 'react';
import { useRouterLoader } from 'routes/hooks/useRouter/useRouterLoader';
import { transformRoutesWithMetadata } from 'routes/utils/transformRoutesWithMetadata';
import { RouteContext } from './RouteContext';
import NotFound from 'pages/NotFound';
import cloneDeep from 'lodash/cloneDeep';

interface RouteProviderProps {
  children: ReactNode;
}

export const RouteProvider: React.FC<RouteProviderProps> = ({ children }) => {
  const [routes, setRoutes] = useState<RouteObject[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // NOTE: contains the logic moved out from useRouter(), and now used as route loader method,
  // making it available app-wide.. Requires big REFACTOR !!
  // Use of useRouter() continues as normal, but now acting as a proxy for this version.
  const { routerLoader } = useRouterLoader();

  useEffect(() => {
    try {
      // const appRoutes = getAppRoutes({ routerLoader });

      const appRoutes = cloneDeep([
        {
          id: 'base',
          path: '/',
          loader: routerLoader,
          element: <LayoutContent />,
          children: [{ path: '*', element: <NotFound /> }],
        },
      ]);

      const routesWithMetadata = transformRoutesWithMetadata(appRoutes, routesConfiguration);
      setRoutes(routesWithMetadata);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  return <RouteContext.Provider value={{ routes, isInitialized }}>{children}</RouteContext.Provider>;
};
