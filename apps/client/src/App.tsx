import '@radix-ui/themes/styles.css';
// import 'styles/radix-ui/radix.css';

import { Suspense } from 'react';
import { ScreenClassProvider, setConfiguration } from 'react-grid-system';
import { Theme as RadixTheme, Spinner } from '@radix-ui/themes';
// import { Global } from '@emotion/react';
// import { cssGlobal } from 'styles/global.styles';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from 'routes/components/ErrorBoundary';
import { useRouteMetadata } from 'routes/providers/RouteMetadataContext';
import { HydrateLoader } from 'routes/components/HydrateLoader';

const AppBaseLayout = () => (
  <ErrorBoundary>
    {/* <Global styles={cssGlobal} /> */}
    <RadixTheme>
      <ScreenClassProvider>
        <Suspense fallback={<Spinner size="3" />}>
          <Outlet />
        </Suspense>
      </ScreenClassProvider>
    </RadixTheme>
  </ErrorBoundary>
);

const App = () => {
  const { isInitialized, ...routesData } = useRouteMetadata();
  setConfiguration();

  const router = createBrowserRouter([
    {
      id: 'routes',
      path: '/',
      loader: () => routesData,
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
