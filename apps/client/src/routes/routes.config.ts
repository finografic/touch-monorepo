import type { RouteObject } from 'react-router-dom';
import type { RouteConfig } from 'routes/routes.types';
import type { OrderField } from 'types/orders.types';

export const ROUTES = {
  HOME: '/',
  DRINK_TYPE: '/drink-type',
  DRINK_SUBTYPE: '/drink-type/drink-subtype',
  DRINK_VOLUME: '/drink-volume',
  CONTAINER_TYPE: '/container-type',
  INITIAL_TEMPERATURE: '/initial-temperature',
  FINAL_TEMPERATURE: '/final-temperature',
} as const;

const _OrderFieldKeys: { [K in OrderField]: K } = {
  drinkType: 'drinkType',
  drinkSubtype: 'drinkSubtype',
  volume: 'volume',
  containerType: 'containerType',
  initialTemperature: 'initialTemperature',
  finalTemperature: 'finalTemperature',
} as const;

export type Routes = (typeof ROUTES)[keyof typeof ROUTES];

export const ROUTES_CONFIG: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    title: 'ServiFresc',
  },
  {
    path: ROUTES.DRINK_TYPE,
    title: 'Select drink type:',
  },
  {
    path: ROUTES.DRINK_SUBTYPE,
    title: 'Select drink subtype:',
  },
  {
    path: ROUTES.DRINK_VOLUME,
    title: 'Select volume:',
  },
  {
    path: ROUTES.CONTAINER_TYPE,
    title: 'Select container type:',
  },
  {
    path: ROUTES.INITIAL_TEMPERATURE,
    title: 'Initial temperature:',
  },
  {
    path: ROUTES.FINAL_TEMPERATURE,
    title: 'Final temperature:',
  },
];

export const ROUTE_ACTION_SLUGS = ['new', 'view', 'edit', 'create', 'delete'];

// ======================================================================== //

type RouteConfig__V1 = Omit<RouteObject, 'path'> & {
  pathname: string;
  title: string;
  // We can add more route-specific config here later like:
  // fetchConfig?: {
  //   endpoint: string;
  //   params?: Record<string, unknown>;
  // };
  // allowBack?: boolean;
  // allowNext?: boolean;
  // etc...
};

export const ROUTE_CONFIG_V1: Record<string, RouteConfig__V1> = {
  [ROUTES.HOME]: {
    pathname: ROUTES.HOME,
    title: 'ServiFresc',
  },
  [ROUTES.DRINK_TYPE]: {
    pathname: ROUTES.DRINK_TYPE,
    title: 'Select drink type:',
  },
  [ROUTES.DRINK_SUBTYPE]: {
    pathname: ROUTES.DRINK_SUBTYPE,
    title: 'Select drink subtype:',
  },
  [ROUTES.DRINK_VOLUME]: {
    pathname: ROUTES.DRINK_VOLUME,
    title: 'Select volume:',
  },
  [ROUTES.CONTAINER_TYPE]: {
    pathname: ROUTES.CONTAINER_TYPE,
    title: 'Select container type:',
  },
  [ROUTES.INITIAL_TEMPERATURE]: {
    pathname: ROUTES.INITIAL_TEMPERATURE,
    title: 'Initial temperature:',
  },
  [ROUTES.FINAL_TEMPERATURE]: {
    pathname: ROUTES.FINAL_TEMPERATURE,
    title: 'Final temperature:',
  },
};
