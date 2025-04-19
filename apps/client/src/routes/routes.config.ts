import type { RouteConfig } from 'types/routes.types';

export const ROUTES = {
  HOME: '/',
  DRINK_TYPE: '/drink-type',
  DRINK_SUBTYPE: '/drink-subtype',
  DRINK_VOLUME: '/drink-volume',
  CONTAINER_TYPE: '/container-type',
  INITIAL_TEMPERATURE: '/initial-temperature',
  FINAL_TEMPERATURE: '/final-temperature',
} as const;

export type Routes = (typeof ROUTES)[keyof typeof ROUTES];

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
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
