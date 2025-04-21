import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from 'pages/LoginPage/LoginPage';
// import { RequireAuth } from './RequireAuth';
import { DashboardPage } from 'pages/DashboardPage/DashboardPage';
import { Layout } from 'layout/Layout';
import { AuthProvider } from 'src/auth/AuthProvider';
import { DocsPage } from '../pages/DocsPage/DocsPage';
import { MenuPage } from '../pages/MenuPage/MenuPage';
import { DrinkTypePage } from '../pages/DrinkPages/DrinkTypePage';
import { DrinkSubtypePage } from '../pages/DrinkPages/DrinkSubtypePage';
import { DrinkVolumePage } from '../pages/DrinkPages/DrinkVolumePage';
import { ContainerTypePage } from '../pages/DrinkPages/ContainerTypePage';
import { TemperatureInitialPage } from '../pages/DrinkPages/TemperatureInitialPage';
import { TemperatureFinalPage } from '../pages/DrinkPages/TemperatureFinalPage';
import { ROUTE_CONFIG, ROUTES } from './routes.config';

// TODO: Create and import these components
// import { DrinkVolumePage } from '../pages/DrinkVolumePage/DrinkVolumePage';
// import { TemperatureFinalPage } from '../pages/TemperatureFinalPage/TemperatureFinalPage';
// import { ContainerTypePage } from '../pages/ContainerTypePage/ContainerTypePage';
// import { TemperatureInitialPage } from '../pages/TemperatureInitialPage/TemperatureInitialPage';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        // element: <HomePage />,
        element: <MenuPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/docs',
        element: <DocsPage />,
      },
      {
        path: '/menu',
        element: <MenuPage />,
      },
      // ============================================== //
      // Drink Configuration Flow
      // ============================================== //
      {
        path: ROUTE_CONFIG[ROUTES.DRINK_TYPE].pathname,
        children: [
          {
            index: true,
            element: <DrinkTypePage />,
          },
          {
            path: ROUTE_CONFIG[ROUTES.DRINK_SUBTYPE].pathname,
            element: <DrinkSubtypePage />,
          },
        ],
      },
      {
        path: ROUTE_CONFIG[ROUTES.DRINK_VOLUME].pathname,
        element: <DrinkVolumePage />,
      },
      {
        path: ROUTE_CONFIG[ROUTES.CONTAINER_TYPE].pathname,
        element: <ContainerTypePage />,
      },
      {
        path: ROUTE_CONFIG[ROUTES.FINAL_TEMPERATURE].pathname,
        element: <TemperatureFinalPage />,
      },
      {
        path: ROUTE_CONFIG[ROUTES.INITIAL_TEMPERATURE].pathname,
        element: <TemperatureInitialPage />,
      },
      // ============================================== //

      {
        path: '/dashboard',
        element: (
          // <RequireAuth>
          <DashboardPage />
          // </RequireAuth>
        ),
      },
    ],
  },
]);
