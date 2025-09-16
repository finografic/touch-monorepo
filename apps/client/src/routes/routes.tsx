import type { RouteObject } from 'react-router-dom';
import { DashboardPage } from 'pages/DashboardPage/DashboardPage';
import { Layout } from 'layout/Layout';
import { AdminLayout } from 'layout/AdminLayout';
import { DocsPage } from 'pages/DocsPage/DocsPage';
import { MainPage } from 'pages/MainPage/MainPage';
import { GenericSelectPage } from 'pages/DrinkPages/GenericSelectPage';
import { ALTERNATIVE_PATHS, PATHS } from './routes.config';
import { AdminFieldKeys, OrderFieldKeys } from 'constants/app.config';
import { LoaderDataHelper } from 'api/loaders/loader.data';
import { AdminPage } from 'pages/AdminPages/AdminPage';
import { AdminTranslationsPage } from 'pages/AdminPages/AdminTranslationsPage/AdminTranslationsPage';
import { AdminLanguagesPage } from 'pages/AdminPages/AdminLanguagesPage/AdminLanguagesPage';
import { AdminUiLabelsPage } from 'pages/AdminPages/AdminUiLabelsPage';
import { TemperaturePage } from 'pages/TemperaturePage/TemperaturePage';
import { TimePage } from 'pages/TimePage/TimePage';
import { AdminOrdersPage } from 'pages/AdminPages/AdminOrdersPage/AdminOrdersPage';
import { AdminFilterAnalysisPage } from 'pages/AdminPages/AdminFilterAnalysisPage';
import { AdminSoundPage } from 'pages/AdminPages/AdminSoundPage/AdminSoundPage';
import { AdminSlotsConfigPage } from 'pages/AdminPages/AdminSlotsConfigPage/AdminSlotsConfigPage';
import { LoginPage } from 'pages/LoginPage/LoginPage';
import { AdminLoginPage } from 'pages/AdminLoginPage/AdminLoginPage';
import { UnauthorizedPage } from 'pages/UnauthorizedPage/UnauthorizedPage';
import { ProtectedRoute } from 'components/ProtectedRoute/ProtectedRoute';
import { AuthTestPage } from 'pages/AuthTestPage/AuthTestPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        id: 'main',
        element: <MainPage />,
      },
      {
        path: '/docs',
        element: <DocsPage />,
      },
      // ============================================== //
      // Drink Configuration Flow
      // ============================================== //
      {
        path: PATHS.drinkType,
        id: OrderFieldKeys.drinkType,
        element: <GenericSelectPage />,
        loader: LoaderDataHelper[OrderFieldKeys.drinkType],
      },
      {
        path: PATHS.drinkSubtype,
        id: OrderFieldKeys.drinkSubtype,
        loader: LoaderDataHelper[OrderFieldKeys.drinkSubtype],
        element: <GenericSelectPage />,
      },
      // ------------------------------------------------------------------------ //
      {
        path: PATHS.drinkVolume,
        id: OrderFieldKeys.drinkVolume,
        loader: LoaderDataHelper[OrderFieldKeys.drinkVolume],
        element: <GenericSelectPage />,
      },
      {
        path: PATHS.containerType,
        id: OrderFieldKeys.containerType,
        loader: LoaderDataHelper[OrderFieldKeys.containerType],
        element: <GenericSelectPage />,
      },
      {
        path: PATHS.temperature,
        id: OrderFieldKeys.temperature,
        loader: LoaderDataHelper[OrderFieldKeys.temperature],
        element: <TemperaturePage />,
      },
      // ============================================== //
      // Alternative flows
      // ============================================== //
      {
        path: ALTERNATIVE_PATHS.time,
        id: 'time',
        element: <TimePage />,
      },
      // ============================================== //
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/unauthorized',
        element: <UnauthorizedPage />,
      },
      {
        path: '/auth-test',
        element: <AuthTestPage />,
      },
    ],
  },
  // ============================================== //
  // Admin Routes with authentication
  // ============================================== //
  {
    path: '/admin',
    children: [
      {
        path: 'login',
        element: <AdminLoginPage />,
      },
      {
        path: '',
        element: (
          // <ProtectedRoute requireAdmin={true} redirectTo="/admin/login">
          <AdminLayout />
          // </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            id: AdminFieldKeys.dashboard,
            element: <AdminPage />,
          },
          {
            path: 'orders',
            id: AdminFieldKeys.itemsList,
            element: <AdminOrdersPage />,
            children: [
              {
                path: ':orderId',
                id: 'order-edit',
                element: <AdminOrdersPage />,
              },
            ],
          },
          {
            path: 'translations',
            id: AdminFieldKeys.translations,
            element: <AdminTranslationsPage />,
          },
          {
            path: 'ui-labels',
            id: AdminFieldKeys.translationsUi,
            element: <AdminUiLabelsPage />,
          },
          {
            path: 'languages',
            id: AdminFieldKeys.languages,
            element: <AdminLanguagesPage />,
          },
          {
            path: 'filter-analysis',
            id: 'filter-analysis',
            element: <AdminFilterAnalysisPage />,
          },
          {
            path: 'sounds',
            id: 'sounds',
            element: <AdminSoundPage />,
          },
          {
            path: 'slot-config',
            id: 'slot-config',
            element: <AdminSlotsConfigPage />,
          },
        ],
      },
    ],
  },
];
