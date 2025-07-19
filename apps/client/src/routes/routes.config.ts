import type { RouteConfig } from 'routes/routes.types';
import type { OrderFieldKey } from 'types/orders.types';
import type { ConstMapOf } from '@workspace/core/types/utils';
import { BUTTON_TYPES, type RouteButtonConfig } from 'types/button.types';

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

export const ROUTE_ACTION_SLUGS = ['new', 'view', 'edit', 'create', 'delete'] as const;

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

// Route-specific button configurations
export const ROUTE_BUTTON_CONFIG: Record<OrderFieldKey, RouteButtonConfig> = {
  main: {
    footer: [BUTTON_TYPES.CANCEL, BUTTON_TYPES.RESET, BUTTON_TYPES.ALL],
    content: [BUTTON_TYPES.PROGRAM_TIME, BUTTON_TYPES.PROGRAM_PRODUCT, BUTTON_TYPES.REPEAT_SELECTION],
  },
  drinkType: {
    footer: [BUTTON_TYPES.BACK, BUTTON_TYPES.NEXT],
    content: [],
  },
  drinkSubtype: {
    footer: [BUTTON_TYPES.BACK, BUTTON_TYPES.NEXT],
    content: [],
  },
  drinkVolume: {
    footer: [BUTTON_TYPES.BACK, BUTTON_TYPES.NEXT],
    content: [],
  },
  containerType: {
    footer: [BUTTON_TYPES.BACK, BUTTON_TYPES.NEXT],
    content: [],
  },
  temperature: {
    footer: [BUTTON_TYPES.BACK, BUTTON_TYPES.START],
    content: [],
  },
};
