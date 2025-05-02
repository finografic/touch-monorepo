import type { RouteObject } from 'react-router-dom';
import type { RouteConfig } from 'routes/routes.types';

export const flatttenChildren = <T extends RouteObject | RouteConfig>(routes: T[]): T[] => {
  const flattened: T[] = [];

  const flatten = (routes: T[]) => {
    for (const route of routes) {
      flattened.push({ ...route, children: undefined });
      if (route?.children && Array.isArray(route.children)) {
        flatten(route.children as T[]);
      }
    }
  };

  flatten(routes);

  return flattened;
};
