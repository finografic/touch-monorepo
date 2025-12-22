import { Outlet, type RouteObject } from 'react-router-dom';
import { AdminDashboardPage } from 'admin/AdminDashboardPage';
import { AdminOrderEditPage } from 'admin/pages/AdminOrdersPage/AdminOrderEditPage';
import { AdminOrdersListPage } from 'admin/pages/AdminOrdersPage/AdminOrdersListPage';
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
import { ROUTE_FILTER_KEYS } from 'config/app';
import { ALTERNATIVE_PATHS, PATHS } from 'config/routes';

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
  // NOTE: null elements are replaced by ADMIN_ROUTE_CONFIGS definition in admin.routes.map.ts
  // ============================================== //
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        element: <ProtectedRoutesByRole />,
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
          { path: 'mode', element: null },
          { path: 'languages', element: null },
          { path: 'sounds', element: null },
          { path: 'maintenance', element: null },
          {
            path: 'items',
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <AdminOrdersListPage />,
              },
              {
                path: 'new',
                element: <AdminOrderEditPage />,
              },
              {
                path: ':orderId',
                element: <AdminOrderEditPage />,
              },
            ],
          },
          { path: 'translations/:domain', element: null },
          { path: 'slots-config', element: null },
          { path: 'relays', element: null },
          { path: 'translations-product', element: null },
        ],
      },
    ],
  },
];
