import type { RouteObject } from 'react-router-dom';
import { Layout } from 'layout/Layout';
import { AdminLayout } from 'layout/AdminLayout';
import { MainPage } from 'pages/MainPage/MainPage';
import { GenericSelectPage } from 'pages/GenericSelectPage/GenericSelectPage';
import { AdminFieldKeys, ROUTE_FILTER_KEYS } from 'config/app';
import { LoaderDataHelper } from 'api/loaders/loader.data';
import { ProtectedRouteWrapper } from 'routes/auth/ProtectedRouteWrapper';
import { ProtectedAdminRoutes } from './auth/ProtectedAdminRoutes';
import { AdminLanguagesPage } from 'admin/pages/AdminLanguagesPage/AdminLanguagesPage';
import { AdminUiLabelsPage } from 'admin/pages/AdminUiLabelsPage';
import { TemperaturePage } from 'pages/TemperaturePage/TemperaturePage';
import { TimePage } from 'pages/TimePage/TimePage';
import { AdminOrdersPage } from 'admin/pages/AdminOrdersPage/AdminOrdersPage';
import { AdminFilterAnalysisPage } from 'admin/pages/AdminFilterAnalysisPage';
import { AdminSoundPage } from 'admin/pages/AdminSoundPage/AdminSoundPage';
import { AdminSlotsConfigPage } from 'admin/pages/AdminSlotsConfigPage/AdminSlotsConfigPage';
import { LoginPage } from 'pages/LoginPage/LoginPage';
import { AdminLoginPage } from 'admin/pages/AdminLoginPage/AdminLoginPage';
import { UnauthorizedPage } from 'pages/UnauthorizedPage/UnauthorizedPage';
import { ProtectedRoute } from 'components/ProtectedRoute/ProtectedRoute';
import { AdminRelaysPage } from 'admin/pages/AdminRelaysPage/AdminRelaysPage';
import { AdminModePage } from 'admin/pages/AdminModePage/AdminModePage';
import { ALTERNATIVE_PATHS, PATHS } from 'config';
import { AdminDashboardWrapper } from 'routes/auth/AdminDashboardWrapper';
import { AdminTranslationsPage } from 'admin/pages/AdminTranslationsPage';

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
            id: 'filterAnalysis',
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
            id: 'slotConfig',
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
                <AdminRelaysPage />
              </ProtectedRouteWrapper>
            ),
          },
          {
            path: 'mode',
            id: 'modo',
            element: (
              <ProtectedRouteWrapper>
                <AdminModePage />
              </ProtectedRouteWrapper>
            ),
          },
        ],
      },
    ],
  },
];
