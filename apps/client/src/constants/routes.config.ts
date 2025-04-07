import { ROUTES } from './routes.constants';
import { PAGE_TITLES } from './pages.constants';
import type { RouteConfig } from 'types/routes.types';

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
  [ROUTES.HOME]: {
    path: ROUTES.HOME,
    title: PAGE_TITLES[ROUTES.HOME],
  },
  [ROUTES.BEVERAGE_TYPE]: {
    path: ROUTES.BEVERAGE_TYPE,
    title: PAGE_TITLES[ROUTES.BEVERAGE_TYPE],
  },
  [ROUTES.BEVERAGE_VOLUME]: {
    path: ROUTES.BEVERAGE_VOLUME,
    title: PAGE_TITLES[ROUTES.BEVERAGE_VOLUME],
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
