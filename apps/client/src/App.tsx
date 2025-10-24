import { Suspense } from 'react';
import { ScreenClassProvider } from 'react-grid-system';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { Global } from '@emotion/react';
import { Spinner, Theme as RadixTheme, Theme } from '@radix-ui/themes';
import { AppConfigProvider } from 'providers/AppConfigProvider';
import { AuthProviderWithInitialization } from 'providers/AuthProvider';
import { SessionProvider } from 'providers/SessionProvider/SessionProvider';

import { ErrorBoundary } from 'routes/components/ErrorBoundary';
import { HydrateLoader } from 'routes/components/HydrateLoader';
import { useRouteMetadata } from 'routes/providers/RouteMetadataContext';

import { cssGlobal } from 'styles/global.styles';
import { ToastProvider } from 'components/Toast/ToastContext';
import { theme } from 'styles/themes/theme';
import { themeConfig } from 'styles/radix-ui/theme.config';

const AppBaseLayout = () => (
  <ErrorBoundary>
    <Global styles={cssGlobal} />
    <AppConfigProvider>
      <Theme {...themeConfig} appearance="light">
        <ToastProvider>
          <AuthProviderWithInitialization>
            <SessionProvider>
              <ScreenClassProvider>
                <Suspense fallback={<Spinner size="3" />}>
                  <Outlet />
                </Suspense>
              </ScreenClassProvider>
            </SessionProvider>
          </AuthProviderWithInitialization>
        </ToastProvider>
      </Theme>
    </AppConfigProvider>
  </ErrorBoundary>
);

const App = () => {
  const { isInitialized, ...routesData } = useRouteMetadata();

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
