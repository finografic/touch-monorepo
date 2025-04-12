import { PAGE_TITLES } from '../constants/pages.constants';
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
    path: ROUTES.HOME,
    title: PAGE_TITLES[ROUTES.HOME],
  },
  [ROUTES.DRINK_TYPE]: {
    path: ROUTES.DRINK_TYPE,
    title: PAGE_TITLES[ROUTES.DRINK_TYPE],
  },
  [ROUTES.DRINK_VOLUME]: {
    path: ROUTES.DRINK_VOLUME,
    title: PAGE_TITLES[ROUTES.DRINK_VOLUME],
  },
  [ROUTES.FINAL_TEMPERATURE]: {
    path: ROUTES.FINAL_TEMPERATURE,
    title: PAGE_TITLES[ROUTES.FINAL_TEMPERATURE],
  },
  [ROUTES.CONTAINER_TYPE]: {
    path: ROUTES.CONTAINER_TYPE,
    title: PAGE_TITLES[ROUTES.CONTAINER_TYPE],
  },
  [ROUTES.INITIAL_TEMPERATURE]: {
    path: ROUTES.INITIAL_TEMPERATURE,
    title: PAGE_TITLES[ROUTES.INITIAL_TEMPERATURE],
  },
};
