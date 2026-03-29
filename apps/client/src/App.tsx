import { Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { Spinner } from '@finografic/design-system/components';

import { Global } from '@emotion/react';
import { SnoozeTimer } from 'components/Timers/SnoozeTimer';
import { Toaster } from 'components/Toast';
import { ToastProvider } from 'components/Toast/ToastContext';

import { AppConfigProvider } from 'providers/AppConfigProvider';
import { AuthProviderWithInitialization } from 'providers/AuthProvider';
import { MetadataProvider } from 'providers/MetadataProvider';
import { SessionProvider } from 'providers/SessionProvider/SessionProvider';
import { TimersProvider } from 'providers/TimersProvider';
import { ErrorBoundary } from 'routes/components/ErrorBoundary';
import { useRouteMetadata } from 'routes/providers/RouteMetadataContext';

import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.min.css'; // core css
import 'queries/relays/relay.store'; // bootstrap relay connection polling
import { cssGlobal } from './styles/global.styles';

const AppBaseLayout = () => (
  <ErrorBoundary>
    <Global styles={cssGlobal} />
    <AppConfigProvider>
      <ToastProvider>
        <AuthProviderWithInitialization>
          <SessionProvider>
            <MetadataProvider>
              <TimersProvider>
                <Toaster />
                <Suspense fallback={<Spinner />}>
                  <Outlet />
                </Suspense>
                <SnoozeTimer shouldDebounce={false} />
              </TimersProvider>
            </MetadataProvider>
          </SessionProvider>
        </AuthProviderWithInitialization>
      </ToastProvider>
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
      children: isInitialized
        ? [...routesData.routes]
        : [
          {
            id: 'pending-routes',
            path: '*',
            element: <Spinner size={16} />,
          },
        ],
    },
  ]);

  // Note: HydrateFallback warning is expected for client-only apps using createBrowserRouter.
  // This is informational and doesn't affect functionality since we're not using SSR.
  return <RouterProvider router={router} />;
};

export default App;
