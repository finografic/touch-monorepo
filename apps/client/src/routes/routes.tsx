import type { RouteObject } from 'react-router-dom';
import { DashboardPage } from 'pages/DashboardPage/DashboardPage';
import { Layout } from 'layout/Layout';
import { AdminLayout } from 'layout/AdminLayout';
import { DocsPage } from 'pages/DocsPage/DocsPage';
import { MainPage } from 'pages/MainPage/MainPage';
import { GenericSelectPage } from 'pages/DrinkPages/GenericSelectPage';
import { AdminFieldKeys, ROUTE_FILTER_KEYS } from 'config/app';
import { LoaderDataHelper } from 'api/loaders/loader.data';
import { AdminPageWrapper } from 'pages/AdminPages/AdminPageWrapper';
import { ProtectedAdminRoute } from 'components/ProtectedAdminRoute';
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
import { AdminRelaysPage } from 'pages/AdminPages/AdminRelaysPage/AdminRelaysPage';
import { RelayPageWrapper } from 'pages/AdminPages/AdminRelaysPage/RelayPageWrapper';
import { ALTERNATIVE_PATHS, PATHS } from 'config';

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
        id: ROUTE_FILTER_KEYS.drinkType,
        element: <GenericSelectPage />,
        loader: LoaderDataHelper[ROUTE_FILTER_KEYS.drinkType],
      },
      {
        path: PATHS.drinkSubtype,
        id: ROUTE_FILTER_KEYS.drinkSubtype,
        loader: LoaderDataHelper[ROUTE_FILTER_KEYS.drinkSubtype],
        element: <GenericSelectPage />,
      },
      // ------------------------------------------------------------------------ //
      {
        path: PATHS.drinkVolume,
        id: ROUTE_FILTER_KEYS.drinkVolume,
        loader: LoaderDataHelper[ROUTE_FILTER_KEYS.drinkVolume],
        element: <GenericSelectPage />,
      },
      {
        path: PATHS.containerType,
        id: ROUTE_FILTER_KEYS.containerType,
        loader: LoaderDataHelper[ROUTE_FILTER_KEYS.containerType],
        element: <GenericSelectPage />,
      },
      {
        path: PATHS.temperature,
        id: ROUTE_FILTER_KEYS.temperature,
        loader: LoaderDataHelper[ROUTE_FILTER_KEYS.temperature],
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
        // Protected admin section
        element: <ProtectedAdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                index: true,
                id: AdminFieldKeys.dashboard,
                element: <AdminPageWrapper />,
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
              {
                path: 'relays',
                id: 'relays',
                element: <RelayPageWrapper />,
              },
            ],
          },
        ],
      },
    ],
  },
];
