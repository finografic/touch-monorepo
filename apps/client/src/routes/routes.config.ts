import type { RouteConfig } from 'routes/routes.types';
import type { OrderFieldKey, OrderFieldKeyKebab } from 'types/orders.types';
import type { ConstMapOf } from 'types/utility.types';

export const PATHS: ConstMapOf<OrderFieldKey, OrderFieldKeyKebab> = {
  home: '/' as OrderFieldKeyKebab,
  drinkType: 'drink-type',
  drinkSubtype: 'drink-subtype',
  drinkVolume: 'drink-volume',
  containerType: 'container-type',
  initialTemperature: 'initial-temperature',
  finalTemperature: 'final-temperature',
} as const;

export type RoutePath = (typeof PATHS)[keyof typeof PATHS];

export const ROUTES_CONFIG: RouteConfig[] = [
  {
    path: PATHS.home,
    id: 'home',
    title: 'ServiFresc',
  },
  {
    path: PATHS.drinkType,
    id: 'drink-type',
    title: 'Select drink type:',
  },
  {
    path: PATHS.drinkSubtype,
    id: 'drink-subtype',
    title: 'Select drink subtype:',
  },
  {
    path: PATHS.drinkVolume,
    id: 'drink-volume',
    title: 'Select volume:',
  },
  {
    path: PATHS.containerType,
    id: 'container-type',
    title: 'Select container type:',
  },
  {
    path: PATHS.initialTemperature,
    id: 'initial-temperature',
    title: 'Initial temperature:',
  },
  {
    path: PATHS.finalTemperature,
    id: 'final-temperature',
    title: 'Final temperature:',
  },
];

export const ROUTE_ACTION_SLUGS = ['new', 'view', 'edit', 'create', 'delete'];
