import type { RouteObject } from 'react-router-dom';
import { DashboardPage } from 'pages/DashboardPage/DashboardPage';
import { Layout } from 'layout/Layout';
import { AdminLayout } from 'layout/AdminLayout';
import { DocsPage } from 'pages/DocsPage/DocsPage';
import { MainPage } from 'pages/MainPage/MainPage';
import { GenericSelectPage } from 'pages/DrinkPages/GenericSelectPage';
import { AdminFieldKeys, ROUTE_FILTER_KEYS } from 'config/app';
import { LoaderDataHelper } from 'api/loaders/loader.data';
import { ProtectedRouteWrapper } from 'routes/ProtectedRouteWrapper';
import { ProtectedAdminRoutes } from './ProtectedAdminRoutes';
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
import { AdminLoginPage } from 'pages/AdminPages/AdminLoginPage/AdminLoginPage';
import { UnauthorizedPage } from 'pages/UnauthorizedPage/UnauthorizedPage';
import { ProtectedRoute } from 'components/ProtectedRoute/ProtectedRoute';
// import { AdminRelaysPage } from 'pages/AdminPages/AdminRelaysPage/AdminRelaysPage';
import { RelayPageWrapper } from 'pages/AdminPages/AdminRelaysPage/RelayPageWrapper';
import { ALTERNATIVE_PATHS, PATHS } from 'config';
import { AdminDashboardWrapper } from 'routes/AdminDashboardWrapper';

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
    element: <AdminLayout />,
    children: [
      {
        path: 'login',
        element: <AdminLoginPage />,
      },
      {
        // Protected admin section
        element: <ProtectedAdminRoutes />,
        children: [
          {
            index: true,
            id: AdminFieldKeys.dashboard,
            element: <AdminDashboardWrapper />,
          },
          {
            path: 'orders',
            id: AdminFieldKeys.itemsList,
            element: (
              <ProtectedRouteWrapper>
                <AdminOrdersPage />
              </ProtectedRouteWrapper>
            ),
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
            element: (
              <ProtectedRouteWrapper>
                <AdminTranslationsPage />
              </ProtectedRouteWrapper>
            ),
          },
          {
            path: 'ui-labels',
            id: AdminFieldKeys.translationsUi,
            element: (
              <ProtectedRouteWrapper>
                <AdminUiLabelsPage />
              </ProtectedRouteWrapper>
            ),
          },
          {
            path: 'languages',
            id: AdminFieldKeys.languages,
            element: (
              <ProtectedRouteWrapper>
                <AdminLanguagesPage />
              </ProtectedRouteWrapper>
            ),
          },
          {
            path: 'filter-analysis',
            id: 'filter-analysis',
            element: (
              <ProtectedRouteWrapper>
                <AdminFilterAnalysisPage />
              </ProtectedRouteWrapper>
            ),
          },
          {
            path: 'sounds',
            id: 'sounds',
            element: (
              <ProtectedRouteWrapper>
                <AdminSoundPage />
              </ProtectedRouteWrapper>
            ),
          },
          {
            path: 'slot-config',
            id: 'slot-config',
            element: (
              <ProtectedRouteWrapper>
                <AdminSlotsConfigPage />
              </ProtectedRouteWrapper>
            ),
          },
          {
            path: 'relays',
            id: 'relays',
            element: (
              <ProtectedRouteWrapper>
                <RelayPageWrapper />
              </ProtectedRouteWrapper>
            ),
          },
        ],
      },
    ],
  },
];
