import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from 'pages/LoginPage/LoginPage';
// import { DashboardPage } from 'pages/DashboardPage/DashboardPage';
// import { RequireAuth } from './RequireAuth';
import { HomePage } from 'pages/HomePage/HomePage';
import { Layout } from 'layout/Layout';
import { AuthProvider } from 'lib/auth/AuthProvider';
import { DocsPage } from '../pages/DocsPage/DocsPage';
import { MenuPage } from '../pages/MenuPage/MenuPage';
import { BeverageTypePage } from '../pages/BeverageTypePage/BeverageTypePage';
import { ROUTES } from '../constants/routes.constants';

// TODO: Create and import these components
// import { BeverageVolumePage } from '../pages/BeverageVolumePage/BeverageVolumePage';
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
        element: <HomePage />,
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
      // Beverage Configuration Flow
      // ============================================== //
      {
        path: ROUTES.BEVERAGE_TYPE,
        element: <BeverageTypePage />,
      },
      {
        path: ROUTES.BEVERAGE_VOLUME,
        element: <div>Volume Page - TODO</div>, // TODO: Replace with BeverageVolumePage
      },
      {
        path: ROUTES.FINAL_TEMPERATURE,
        element: <div>Final Temperature Page - TODO</div>, // TODO: Replace with FinalTemperaturePage
      },
      {
        path: ROUTES.CONTAINER_TYPE,
        element: <div>Container Type Page - TODO</div>, // TODO: Replace with ContainerTypePage
      },
      {
        path: ROUTES.INITIAL_TEMPERATURE,
        element: <div>Initial Temperature Page - TODO</div>, // TODO: Replace with InitialTemperaturePage
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
