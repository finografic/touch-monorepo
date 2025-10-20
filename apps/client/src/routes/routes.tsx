import type { RouteObject } from 'react-router-dom';

import { AdminDashboardPage } from 'admin/AdminDashboardPage';
import { AdminFilterAnalysisPage } from 'admin/pages/AdminFilterAnalysisPage';
import { AdminLanguagesPage } from 'admin/pages/AdminLanguagesPage/AdminLanguagesPage';
import { AdminLoginPage } from 'admin/pages/AdminLoginPage/AdminLoginPage';
import { AdminModePage } from 'admin/pages/AdminModePage/AdminModePage';
import { AdminOrdersPage } from 'admin/pages/AdminOrdersPage/AdminOrdersPage';
import { AdminRelaysPage } from 'admin/pages/AdminRelaysPage/AdminRelaysPage';
import { AdminSlotsConfigPage } from 'admin/pages/AdminSlotsConfigPage/AdminSlotsConfigPage';
import { AdminSoundPage } from 'admin/pages/AdminSoundPage/AdminSoundPage';
import { AdminTranslationsPage } from 'admin/pages/AdminTranslationsPage';
import { AdminUiLabelsPage } from 'admin/pages/AdminUiLabelsPage';
import { LoaderDataHelper } from 'api/loaders/loader.data';
import { AdminLayout } from 'layout/AdminLayout';
import { Layout } from 'layout/Layout';
import { ProtectedRoute } from 'components/ProtectedRoute/ProtectedRoute';
import { GenericSelectPage } from 'pages/GenericSelectPage/GenericSelectPage';
import { LoginPage } from 'pages/LoginPage/LoginPage';
import { MainPage } from 'pages/MainPage/MainPage';
import { TemperaturePage } from 'pages/TemperaturePage/TemperaturePage';
import { TimePage } from 'pages/TimePage/TimePage';
import { UnauthorizedPage } from 'pages/UnauthorizedPage/UnauthorizedPage';

import { ALTERNATIVE_PATHS, PATHS } from 'config';
import { AdminFieldKeys, ROUTE_FILTER_KEYS } from 'config/app';
import { ProtectedAdminRoutes } from './auth/ProtectedAdminRoutes';

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
            element: <AdminDashboardPage />,
          },
          {
            path: 'orders',
            id: AdminFieldKeys.itemsList,
            element: <AdminOrdersPage />,
            children: [
              {
                index: true,
                id: AdminFieldKeys.dashboard,
                element: <AdminOrdersPage />,
              },
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
            id: 'filterAnalysis',
            element: <AdminFilterAnalysisPage />,
          },
          {
            path: 'sounds',
            id: 'sounds',
            element: <AdminSoundPage />,
          },
          {
            path: 'slot-config',
            id: 'slotConfig',
            element: <AdminSlotsConfigPage />,
          },
          {
            path: 'relays',
            id: 'relays',
            element: <AdminRelaysPage />,
          },
          {
            path: 'mode',
            id: 'modo',
            element: <AdminModePage />,
          },
        ],
      },
    ],
  },
];
