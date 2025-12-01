import { Suspense } from 'react';
import { ScreenClassProvider } from 'react-grid-system';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { Global } from '@emotion/react';
import { Spinner, Theme as RadixTheme } from '@radix-ui/themes';
import { SnoozeTimer } from 'components/Timers/SnoozeTimer';
import { Toaster } from 'components/Toast';
import { ToastProvider } from 'components/Toast/ToastContext';

import { AppConfigProvider } from 'providers/AppConfigProvider';
import { AuthProviderWithInitialization } from 'providers/AuthProvider';
import { EmotionThemeProvider } from 'providers/EmotionThemeProvider';
import { SessionProvider } from 'providers/SessionProvider/SessionProvider';
import { TimersProvider } from 'providers/TimersProvider';
import { ErrorBoundary } from 'routes/components/ErrorBoundary';
import { useRouteMetadata } from 'routes/providers/RouteMetadataContext';

import { themeConfig } from 'styles/radix-ui/theme.config';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.min.css'; // core css
// import 'primeicons/primeicons.css'; // icons
// import 'primeflex/primeflex.css'; // flex
// import { theme } from 'styles/themes/theme';
import { cssGlobal } from 'styles/global.styles';

const AppBaseLayout = () => (
  <ErrorBoundary>
    <Global styles={cssGlobal} />
    <EmotionThemeProvider>
      <AppConfigProvider>
        <RadixTheme {...themeConfig} appearance="light">
          <ToastProvider>
            <AuthProviderWithInitialization>
              <SessionProvider>
                <ScreenClassProvider>
                  <TimersProvider>
                    <Toaster />
                    <Suspense fallback={<Spinner size="3" />}>
                      <Outlet />
                    </Suspense>
                    <SnoozeTimer shouldDebounce={false} />
                  </TimersProvider>
                </ScreenClassProvider>
              </SessionProvider>
            </AuthProviderWithInitialization>
          </ToastProvider>
        </RadixTheme>
      </AppConfigProvider>
    </EmotionThemeProvider>
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
        : [{ id: 'pending-routes', path: '*', element: <Spinner size="2" /> }],
    },
  ]);

  // Note: HydrateFallback warning is expected for client-only apps using createBrowserRouter.
  // This is informational and doesn't affect functionality since we're not using SSR.
  return <RouterProvider router={router} hydrateFallback={<Spinner size="2" />} />;
};

export default App;
