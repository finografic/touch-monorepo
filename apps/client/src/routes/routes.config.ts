import type { RouteObject } from 'react-router-dom';
import type { RouteConfig } from 'routes/routes.types';
import type { OrderFieldKeyKebab, OrderFieldKeySnake } from 'types/orders.types';
import type { ConstMapOf } from 'types/utility.types';

export const PATHS: ConstMapOf<Uppercase<OrderFieldKeySnake & 'home'>, OrderFieldKeyKebab | '/'> = {
  HOME: '/',
  DRINK_TYPE: 'drink-type',
  DRINK_SUBTYPE: 'drink-subtype',
  DRINK_VOLUME: 'drink-volume',
  CONTAINER_TYPE: 'container-type',
  INITIAL_TEMPERATURE: 'initial-temperature',
  FINAL_TEMPERATURE: 'final-temperature',
} as const;

export type Routes = (typeof PATHS)[keyof typeof PATHS];

export const ROUTES_CONFIG: RouteConfig[] = [
  {
    path: PATHS.HOME,
    id: 'home',
    title: 'ServiFresc',
  },
  {
    path: PATHS.DRINK_TYPE,
    id: 'drink-type',
    title: 'Select drink type:',
  },
  {
    path: PATHS.DRINK_SUBTYPE,
    id: 'drink-subtype',
    title: 'Select drink subtype:',
  },
  {
    path: PATHS.DRINK_VOLUME,
    id: 'drink-volume',
    title: 'Select volume:',
  },
  {
    path: PATHS.CONTAINER_TYPE,
    id: 'container-type',
    title: 'Select container type:',
  },
  {
    path: PATHS.INITIAL_TEMPERATURE,
    id: 'initial-temperature',
    title: 'Initial temperature:',
  },
  {
    path: PATHS.FINAL_TEMPERATURE,
    id: 'final-temperature',
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
  HOME: {
    pathname: '/',
    title: 'ServiFresc',
  },
  [PATHS.DRINK_TYPE]: {
    pathname: PATHS.DRINK_TYPE,
    title: 'Select drink type:',
  },
  [PATHS.DRINK_SUBTYPE]: {
    pathname: PATHS.DRINK_SUBTYPE,
    title: 'Select drink subtype:',
  },
  [PATHS.DRINK_VOLUME]: {
    pathname: PATHS.DRINK_VOLUME,
    title: 'Select volume:',
  },
  [PATHS.CONTAINER_TYPE]: {
    pathname: PATHS.CONTAINER_TYPE,
    title: 'Select container type:',
  },
  [PATHS.INITIAL_TEMPERATURE]: {
    pathname: PATHS.INITIAL_TEMPERATURE,
    title: 'Initial temperature:',
  },
  [PATHS.FINAL_TEMPERATURE]: {
    pathname: PATHS.FINAL_TEMPERATURE,
    title: 'Final temperature:',
  },
};
