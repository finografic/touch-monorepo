import { Outlet, type RouteObject } from 'react-router-dom';

import { AdminDashboardPage } from 'admin/AdminDashboardPage';
import { AdminLanguagesPage } from 'admin/pages/AdminLanguagesPage/AdminLanguagesPage';
import { PublicModePage } from 'admin/pages/AdminModePage';
import { AdminOrderEditPage } from 'admin/pages/AdminOrdersPage/AdminOrderEditPage';
import { AdminOrdersListPage } from 'admin/pages/AdminOrdersPage/AdminOrdersListPage';
import { AdminRelaysPage } from 'admin/pages/AdminRelaysPage/AdminRelaysPage';
// import { AdminLoginPage } from 'admin/pages/AdminLoginPage/AdminLoginPage';
import { AdminTestPage } from 'admin/pages/AdminTestPage/AdminTestPage';
import { PublicRelaysPage } from 'admin/pages/AdminRelaysPage/PublicRelaysPage';
import { AdminSlotsConfigPage } from 'admin/pages/AdminSlotsConfigPage/AdminSlotsConfigPage';
import { AdminSoundPage } from 'admin/pages/AdminSoundPage/AdminSoundPage';
import { TranslationsProductPage } from 'admin/pages/TranslationsProductPage';
import { TranslationsUiPage } from 'admin/pages/TranslationsUiPage';
import { LoaderDataHelper } from 'api/loaders/loader.data';
import { AdminLayout } from 'layout/AdminLayout';
import { Layout } from 'layout/Layout';
import { ColorTestPage } from 'pages/ColorTestPage';
import { GenericSelectPage } from 'pages/GenericSelectPage/GenericSelectPage';
import { LoginPage } from 'pages/LoginPage/LoginPage';
import { MainPage } from 'pages/MainPage/MainPage';
import { TemperaturePage } from 'pages/TemperaturePage/TemperaturePage';
import { TimePage } from 'pages/TimePage/TimePage';
import { UnauthorizedPage } from 'pages/UnauthorizedPage/UnauthorizedPage';

import { ProtectedRoutesByRole } from 'routes/auth/ProtectedRoutesByRole';

import { ALTERNATIVE_PATHS, PATHS } from 'config/routes';
import { AdminFieldKeys, ROUTE_FILTER_KEYS } from 'config/app';

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
        path: '/color-test',
        id: 'color-test',
        element: <ColorTestPage />,
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
        // element: <UnauthorizedPage />,
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
  // Admin Routes - Protected
  // ============================================== //
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        // Protected admin section
        element: <ProtectedRoutesByRole />,
        children: [
          // DASHBOARD (accessible to all - index route)
          {
            index: true,
            id: AdminFieldKeys.dashboard,
            element: <AdminDashboardPage />, // <div style={{ padding: '20rem' }}>DASHBOARD</div>,
          },
          // PUBLIC ENTRIES (accessible without login)
          {
            path: 'mode', // public-only
            id: AdminFieldKeys.mode,
            element: <PublicModePage />,
          },
          {
            path: 'languages', // TODO: SHARED
            id: AdminFieldKeys.languages,
            element: <AdminLanguagesPage />,
          },
          {
            path: 'sounds', // TODO: SHARED
            id: AdminFieldKeys.sounds,
            element: <AdminSoundPage />,
            // element: <div style={{ padding: '20rem' }}>SOUNDS</div>,
          },
          {
            path: 'maintenance', // relays (public-only)
            id: AdminFieldKeys.maintenance,
            element: <PublicRelaysPage />,
          },
          // AUTHENTICATED ENTRIES (only visible as admin)
          {
            path: 'items',
            id: AdminFieldKeys.items,
            element: <Outlet />, // Parent route with Outlet for nested routes
            children: [
              {
                index: true,
                id: 'order-list',
                element: <AdminOrdersListPage />,
              },
              {
                path: 'new',
                id: 'order-create',
                element: <AdminOrderEditPage />, // Same component, different mode
              },
              {
                path: ':orderId',
                id: 'order-edit',
                element: <AdminOrderEditPage />,
              },
            ],
          },
          {
            path: 'slots-config',
            id: 'slotsConfig',
            element: <AdminSlotsConfigPage />,
          },
          {
            path: 'relays',
            id: 'relays',
            element: <AdminRelaysPage />,
          },
          {
            path: 'translations',
            id: AdminFieldKeys.translations,
            element: <TranslationsProductPage />,
          },
          {
            path: 'translations-test',
            id: AdminFieldKeys.translationsTest,
            element: <AdminTestPage />,
          },
          {
            path: 'ui-labels',
            id: AdminFieldKeys.translationsUi,
            element: <TranslationsUiPage />,
          },
        ],
      },
    ],
  },
];
