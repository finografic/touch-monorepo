import type { RouteConfig } from 'routes/routes.types';
import type { OrderFieldKeyKebab, OrderFieldKeySnake } from 'types/orders.types';
import type { ConstMapOf } from 'types/utility.types';

export const PATHS: ConstMapOf<Uppercase<OrderFieldKeySnake>, OrderFieldKeyKebab> & {
  HOME: '/';
} = {
  HOME: '/',
  DRINK_TYPE: 'drink-type',
  DRINK_SUBTYPE: 'drink-subtype',
  DRINK_VOLUME: 'drink-volume',
  CONTAINER_TYPE: 'container-type',
  INITIAL_TEMPERATURE: 'initial-temperature',
  FINAL_TEMPERATURE: 'final-temperature',
} as const;

export type RoutePath = (typeof PATHS)[keyof typeof PATHS];

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
