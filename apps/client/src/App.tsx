import '@radix-ui/themes/styles.css';
// import 'styles/radix-ui/radix.css';

import { ScreenClassProvider } from 'react-grid-system';
import { Theme as RadixTheme, Spinner } from '@radix-ui/themes';
import { Global } from '@emotion/react';
import { cssGlobal } from 'styles/global.styles';
import { createBrowserRouter, Outlet, RouterProvider, useRoutes } from 'react-router-dom';
import { router } from 'routes/router';
import { ErrorBoundary } from 'routes/ErrorBoundary';
import { HydrateFallback } from 'routes/HydrateFallback';
import type { Layout } from 'layout/Layout';
import type { Suspense } from 'react';
// import { OrdersProvider } from './providers/OrdersProvider/OrdersProvider';
import { useRouterLoader } from 'routes/hooks/useRouterLoader';

const AppBaseLayout = () => (
  <ErrorBoundary>
    <ScreenClassProvider>
      <Global styles={cssGlobal} />
      <RadixTheme>
        <LayoutProvider contextName="layout" value={{ ...initialState }}>
          <Layout>
            <Suspense fallback={<Spinner />}>
              <Outlet />
            </Suspense>
          </Layout>
        </LayoutProvider>
      </RadixTheme>
    </ScreenClassProvider>
  </ErrorBoundary>
);

// export function App() {
//   return (
//     <ScreenClassProvider>
//       <Global styles={cssGlobal} />
//       <RadixTheme>
//         <RouterProvider router={router} />
//       </RadixTheme>
//     </ScreenClassProvider>
//   );
// }

const App = () => {
  const { routerLoader } = useRouterLoader();

  // Base routes that are always available
  const baseRoutes = [
    {
      id: 'root',
      path: '/',
      loader: routerLoader,
      element: <AppBaseLayout />,
      children: [
        {
          id: 'pending-routes',
          path: '*',
          element: <Spinner />,
        },
      ],
    },
  ];

  // Create router based on available routes
  const router = createBrowserRouter([
    {
      id: 'root',
      path: '/',
      loader: routerLoader,
      // loader: () => routes,
      element: <AppBaseLayout />,
      children: routes,
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
