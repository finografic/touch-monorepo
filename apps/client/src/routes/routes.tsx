import type { RouteObject } from 'react-router-dom';
import { DashboardPage } from 'pages/DashboardPage/DashboardPage';
import { Layout } from 'layout/Layout';
import { AdminLayout } from 'layout/AdminLayout';
import { DocsPage } from '../pages/DocsPage/DocsPage';
import { MainPage } from '../pages/MainPage/MainPage';
import { GenericSelectPage } from '../pages/DrinkPages/GenericSelectPage';
import { ALTERNATIVE_PATHS, PATHS } from './routes.config';
import { AdminFieldKeys, OrderFieldKeys } from 'constants/app.config';
import { LoaderDataHelper } from 'api/loaders/loader.data';
import { AdminPage } from 'pages/AdminPages/AdminPage';
import { AdminTranslationsPage } from 'pages/AdminPages/AdminTranslationsPage/AdminTranslationsPage';
import { AdminLanguagesPage } from 'pages/AdminPages/AdminLanguagesPage/AdminLanguagesPage';
import { TemperaturePage } from 'pages/TemperaturePage/TemperaturePage';
import { TimePage } from 'pages/TimePage/TimePage';

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
          // <RequireAuth>
          <DashboardPage />
          // </RequireAuth>
        ),
      },
      // {
      //   path: '/login',
      //   element: <LoginPage />,
      // },
    ],
  },
  // ============================================== //
  // Admin Routes with simplified layout
  // ============================================== //
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        id: 'admin',
        element: <AdminPage />,
      },
      {
        path: 'translations',
        id: 'admin-translations',
        element: <AdminTranslationsPage />,
      },
      {
        path: 'languages',
        id: 'admin-languages',
        // loader: LoaderDataHelper[AdminFieldKeys.languages],
        element: <AdminLanguagesPage />,
      },
      // Future admin routes can be added here
      // {
      //   path: 'users',
      //   element: <AdminUsersPage />,
      // },
      // {
      //   path: 'settings',
      //   element: <AdminSettingsPage />,
      // },
    ],
  },
];
