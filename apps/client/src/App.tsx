import '@radix-ui/themes/styles.css';
// import 'styles/radix-ui/radix.css';

import { ScreenClassProvider } from 'react-grid-system';
import { Theme as RadixTheme, Spinner } from '@radix-ui/themes';
import { Global } from '@emotion/react';
import { cssGlobal } from 'styles/global.styles';
import { createBrowserRouter, Outlet, type RouteObject, RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from 'routes/components/ErrorBoundary';
import { Suspense } from 'react';
import { useRouterLoader } from 'routes/hooks/useRouterLoader';
import { useRouteMetadata } from 'routes/providers/RouteMetadataContext';
import { HydrateLoader } from 'routes/components/HydrateLoader';
import { flatttenChildren } from 'routes/utils/routes.utils.flatten';
import type { RouteConfig } from 'routes/routes.types';

const AppBaseLayout = () => (
  <ErrorBoundary>
    <ScreenClassProvider>
      <Global styles={cssGlobal} />
      <RadixTheme>
        <Suspense fallback={<Spinner size="3" />}>
          <Outlet />
        </Suspense>
      </RadixTheme>
    </ScreenClassProvider>
  </ErrorBoundary>
);

const App = () => {
  const { isInitialized, ...routesData } = useRouteMetadata();
  // const { routerLoader } = useRouterLoader();

  log('__TEST', 'lime', routesData);

  const router = createBrowserRouter([
    {
      id: 'routes',
      path: '/',
      loader: () => routesData, // loader: () => routes,
      element: <AppBaseLayout />,
      hydrateFallbackElement: <HydrateLoader />,
      children: isInitialized
        ? [...routesData.routes]
        : [{ id: 'pending-routes', path: '*', element: <Spinner size="2" /> }],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
