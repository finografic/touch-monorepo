import '@radix-ui/themes/styles.css';
// import 'styles/radix-ui/radix.css';

import { ScreenClassProvider } from 'react-grid-system';
import { Theme as RadixTheme, Spinner } from '@radix-ui/themes';
import { Global } from '@emotion/react';
import { cssGlobal } from 'styles/global.styles';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from 'routes/components/ErrorBoundary';
import { Suspense } from 'react';
import { useRouterLoader } from 'routes/hooks/useRouterLoader';
import { useRouteMetadata } from 'routes/providers/RouteMetadataContext';
// import { HydrateFallback } from 'routes/HydrateFallback';

const AppBaseLayout = () => (
  <ErrorBoundary>
    <ScreenClassProvider>
      <Global styles={cssGlobal} />
      <RadixTheme>
        <Suspense fallback={<Spinner size="2" />}>
          <Outlet />
        </Suspense>
      </RadixTheme>
    </ScreenClassProvider>
  </ErrorBoundary>
);

const App = () => {
  const { routes, isInitialized } = useRouteMetadata();
  const { routerLoader } = useRouterLoader();

  const router = createBrowserRouter([
    {
      id: 'root',
      path: '/',
      loader: routerLoader, // loader: () => routes,
      element: <AppBaseLayout />,
      errorElement: (
        <ErrorBoundary>
          <RadixTheme>
            <Spinner size="2" />
          </RadixTheme>
        </ErrorBoundary>
      ),
      children: isInitialized
        ? [...routes]
        : [{ id: 'pending-routes', path: '*', element: <Spinner size="2" /> }],
    },
  ]);

  return (
    <RouterProvider
      router={router}
      // fallbackElement={<HydrateFallback />}
    />
  );
};

export default App;
