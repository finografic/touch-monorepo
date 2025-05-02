import type { RouteObject } from 'react-router-dom';
// import { LoginPage } from 'pages/LoginPage/LoginPage';
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
import { PATHS, ROUTES_CONFIG } from './routes.config';
import { OrderFieldKeys } from 'constants/app.config';
import { LoaderDataHelper } from 'api/loaders/loader.data';

export const routes: RouteObject[] = [
  {
    path: '/',
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
      {
        path: '/docs',
        element: <DocsPage />,
      },

      // ============================================== //
      // Drink Configuration Flow
      // ============================================== //

      {
        path: PATHS.DRINK_TYPE,
        children: [
          {
            index: true,
            id: OrderFieldKeys.drinkType,
            element: <DrinkTypePage />,
            loader: LoaderDataHelper[OrderFieldKeys.drinkType],
          },
          {
            path: PATHS.DRINK_SUBTYPE,
            id: OrderFieldKeys.drinkSubtype,
            loader: LoaderDataHelper[OrderFieldKeys.drinkSubtype],
            element: <DrinkSubtypePage />,
          },
        ],
      },
      {
        path: PATHS.DRINK_VOLUME,
        id: OrderFieldKeys.drinkVolume,
        loader: LoaderDataHelper[OrderFieldKeys.drinkVolume],
        element: <DrinkVolumePage />,
      },
      {
        path: PATHS.CONTAINER_TYPE,
        id: OrderFieldKeys.containerType,
        loader: LoaderDataHelper[OrderFieldKeys.containerType],
        element: <ContainerTypePage />,
      },
      {
        path: PATHS.INITIAL_TEMPERATURE,
        id: OrderFieldKeys.initialTemperature,
        loader: LoaderDataHelper[OrderFieldKeys.initialTemperature],
        element: <TemperatureInitialPage />,
      },
      {
        path: PATHS.FINAL_TEMPERATURE,
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
      // {
      //   path: '/login',
      //   element: <LoginPage />,
      // },
    ],
  },
];
