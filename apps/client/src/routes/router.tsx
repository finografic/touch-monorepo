import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from 'pages/LoginPage/LoginPage';
// import { DashboardPage } from 'pages/DashboardPage/DashboardPage';
// import { RequireAuth } from './RequireAuth';
import { HomePage } from 'pages/HomePage/HomePage';
import { Layout } from 'layout/Layout';
import { AuthProvider } from 'lib/auth/AuthProvider';
import { DocsPage } from '../pages/DocsPage/DocsPage';
import { MenuPage } from '../pages/MenuPage/MenuPage';
import { DrinkTypePage } from '../pages/DrinkPages/DrinkTypePage';
import { DrinkVolumePage } from '../pages/DrinkPages/DrinkVolumePage';
import { ContainerTypePage } from '../pages/DrinkPages/ContainerTypePage';
import { ROUTES, ROUTE_CONFIG } from './routes.config';

// TODO: Create and import these components
// import { DrinkVolumePage } from '../pages/DrinkVolumePage/DrinkVolumePage';
// import { FinalTemperaturePage } from '../pages/FinalTemperaturePage/FinalTemperaturePage';
// import { ContainerTypePage } from '../pages/ContainerTypePage/ContainerTypePage';
// import { InitialTemperaturePage } from '../pages/InitialTemperaturePage/InitialTemperaturePage';

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
        element: <DrinkTypePage />,
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
        element: <div>Final Temperature Page - TODO</div>,
      },
      {
        path: ROUTE_CONFIG[ROUTES.INITIAL_TEMPERATURE].pathname,
        element: <div>Initial Temperature Page - TODO</div>,
      },
      // ============================================== //
      /*
      {
        path: '/dashboard',
        element: (
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        ),
      },
      */
    ],
  },
]);
