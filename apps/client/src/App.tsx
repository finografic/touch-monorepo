import '@radix-ui/themes/styles.css';
// import 'styles/radix-ui/radix.css';

import { ScreenClassProvider } from 'react-grid-system';
import { Theme as RadixTheme, Spinner } from '@radix-ui/themes';
import { Global } from '@emotion/react';
import { cssGlobal } from 'styles/global.styles';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from 'routes/ErrorBoundary';
import { Suspense } from 'react';
import { useRouterLoader } from 'routes/hooks/useRouterLoader';
import { useRoutes as useRoutesTree } from 'routes/context/RoutesContext';

const AppBaseLayout = () => (
  <ErrorBoundary>
    <ScreenClassProvider>
      <Global styles={cssGlobal} />
      <RadixTheme>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </RadixTheme>
    </ScreenClassProvider>
  </ErrorBoundary>
);

const App = () => {
  const { routes, isInitialized } = useRoutesTree();
  const { routerLoader } = useRouterLoader();

  const router = createBrowserRouter([
    {
      id: 'root',
      path: '/',
      loader: routerLoader, // loader: () => routes,
      element: <AppBaseLayout />,
      children: isInitialized ? [...routes] : [{ id: 'pending-routes', path: '*', element: <Spinner /> }],
    },
  ]);

  return (
    <RouterProvider
      router={router}
      //  fallbackElement={<HydrateFallback />}
    />
  );
};

export default App;
