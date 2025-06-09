import type { RouteObject } from 'react-router-dom';
import type { RouteConfig } from 'routes/routes.types';

export const flatttenChildren = <T extends RouteObject | RouteConfig>(routes: T[]): T[] => {
  const flattened: T[] = [];

  const flatten = (routes: T[]) => {
    for (const route of routes) {
      // Only clone the properties we need, excluding React elements
      const { element, children, ...routeProps } = route;
      flattened.push({ ...routeProps } as T);

      if (children && Array.isArray(children)) {
        flatten(children as T[]);
      }
    }
  };

  flatten(routes);
  return flattened;
};
