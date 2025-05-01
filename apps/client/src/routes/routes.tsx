import type { RouteObject } from 'react-router-dom';
import { LoginPage } from 'pages/LoginPage/LoginPage';
// import { RequireAuth } from './RequireAuth';
import { DashboardPage } from 'pages/DashboardPage/DashboardPage';
import { Layout } from 'layout/Layout';
import { DocsPage } from '../pages/DocsPage/DocsPage';
import { MenuPage } from '../pages/MenuPage/MenuPage';
import { DrinkTypePage } from '../pages/DrinkPages/DrinkTypePage';
import { DrinkSubtypePage } from '../pages/DrinkPages/DrinkSubtypePage';
import { DrinkVolumePage } from '../pages/DrinkPages/DrinkVolumePage';
import { ContainerTypePage } from '../pages/DrinkPages/ContainerTypePage';
import { TemperatureInitialPage } from '../pages/DrinkPages/TemperatureInitialPage';
import { TemperatureFinalPage } from '../pages/DrinkPages/TemperatureFinalPage';
import { ROUTE_CONFIG_V1, ROUTES } from './routes.config';
import { OrderFieldKeys } from 'constants/app.config';
import { LoaderDataHelper } from 'api/loaders/loader.data';

export const routes: RouteObject[] = [
  {
    path: ROUTES.HOME,
    // element: <Layout />,
    element: (
      // <AuthProvider>
      <Layout />
      // </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <MenuPage />,
      },
      // {
      //   path: '/menu',
      //   // index: true,
      //   // element: <HomePage />,
      //   element: <MenuPage />,
      // },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/docs',
        element: <DocsPage />,
      },

      // ============================================== //
      // Drink Configuration Flow
      // ============================================== //

      {
        path: ROUTE_CONFIG_V1[ROUTES.DRINK_TYPE].pathname,
        id: OrderFieldKeys.drinkType,
        loader: LoaderDataHelper[OrderFieldKeys.drinkType],
        children: [
          {
            index: true,
            element: <DrinkTypePage />,
          },
          {
            path: ROUTE_CONFIG_V1[ROUTES.DRINK_SUBTYPE].pathname,
            id: OrderFieldKeys.drinkSubtype,
            loader: LoaderDataHelper[OrderFieldKeys.drinkSubtype],
            element: <DrinkSubtypePage />,
          },
        ],
      },
      {
        path: ROUTE_CONFIG_V1[ROUTES.DRINK_VOLUME].pathname,
        id: OrderFieldKeys.volume,
        loader: LoaderDataHelper[OrderFieldKeys.volume],
        element: <DrinkVolumePage />,
      },
      {
        path: ROUTE_CONFIG_V1[ROUTES.CONTAINER_TYPE].pathname,
        id: OrderFieldKeys.containerType,
        loader: LoaderDataHelper[OrderFieldKeys.containerType],
        element: <ContainerTypePage />,
      },
      {
        path: ROUTE_CONFIG_V1[ROUTES.INITIAL_TEMPERATURE].pathname,
        id: OrderFieldKeys.initialTemperature,
        loader: LoaderDataHelper[OrderFieldKeys.initialTemperature],
        element: <TemperatureInitialPage />,
      },
      {
        path: ROUTE_CONFIG_V1[ROUTES.FINAL_TEMPERATURE].pathname,
        id: OrderFieldKeys.finalTemperature,
        loader: LoaderDataHelper[OrderFieldKeys.finalTemperature],
        element: <TemperatureFinalPage />,
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
    ],
  },
];
