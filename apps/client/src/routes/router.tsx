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

export const router = createBrowserRouter([
  {
    path: '/',
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
      // NOTE: BEVERAGE FLOW ROUTES
      {
        path: '/beverage-type',
        element: <BeverageTypePage />,
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
