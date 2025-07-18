import type { RouteConfig } from 'routes/routes.types';
import type { OrderFieldKey } from 'types/orders.types';
import type { ConstMapOf } from '@workspace/core/types/utils';

export const PATHS: ConstMapOf<OrderFieldKey, string> = {
  main: '/',
  drinkType: '/drink-type',
  drinkSubtype: '/drink-type/:drinkTypeId',
  drinkVolume: '/drink-volume',
  containerType: '/container-type',
  temperature: '/temperature',
} as const;

// Additional paths for alternative flows
export const ALTERNATIVE_PATHS = {
  time: '/time',
  admin: '/admin',
} as const;

export const ROUTES_CONFIG: RouteConfig[] = [
  {
    path: PATHS.main,
    id: 'main',
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
    path: PATHS.temperature,
    id: 'temperature',
    title: 'Select initial and final temperatures:',
  },
];

export const ROUTE_ACTION_SLUGS = ['new', 'view', 'edit', 'create', 'delete'];
