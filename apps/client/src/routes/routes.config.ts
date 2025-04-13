import type { RouteConfig } from 'types/routes.types';

export const ROUTES = {
  HOME: '/',
  DRINK_TYPE: '/drink-type',
  DRINK_VOLUME: '/drink-volume',
  FINAL_TEMPERATURE: '/final-temperature',
  CONTAINER_TYPE: '/container-type',
  INITIAL_TEMPERATURE: '/initial-temperature',
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
  [ROUTES.DRINK_VOLUME]: {
    pathname: ROUTES.DRINK_VOLUME,
    title: 'Select volume:',
  },
  [ROUTES.FINAL_TEMPERATURE]: {
    pathname: ROUTES.FINAL_TEMPERATURE,
    title: 'Temperatura final:',
  },
  [ROUTES.CONTAINER_TYPE]: {
    pathname: ROUTES.CONTAINER_TYPE,
    title: 'Seleccione tipo de envase:',
  },
  [ROUTES.INITIAL_TEMPERATURE]: {
    pathname: ROUTES.INITIAL_TEMPERATURE,
    title: 'Temperatura inicial:',
  },
};
