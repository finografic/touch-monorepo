import cloneDeep from 'lodash/cloneDeep';
import type { RouteObject } from 'react-router-dom';
import { ROUTE_ACTION_SLUGS } from 'config';
import type { RouteConfig } from 'routes/routes.types';

export const generatePathname = (path: string | undefined, parentPath: string = ''): string => {
  if (!path) return parentPath || '/';
  return path === '/' ? '/' : `${parentPath}/${path}`.replace(/\/+/g, '/');
};

export const getPathSlug = (pathname: string, customSlug?: string): string | undefined => {
  const actionSegments = customSlug ? [...ROUTE_ACTION_SLUGS, customSlug] : ROUTE_ACTION_SLUGS;
  const segments = pathname
    .split('/')
    .filter(
      (segment) =>
        segment &&
        !segment.startsWith(':') &&
        !actionSegments.includes(segment as (typeof ROUTE_ACTION_SLUGS)[number]),
    );

  return segments.length > 0 ? segments[segments.length - 1] : undefined;
};

export const cleanRoutePath = (path: string) => {
  const cleaned = path
    .replace(/undefined/g, '')
    .replace(/\/\/\//g, '/')
    .replace(/\/\//g, '/');

  return cleaned;
};

export const cleanRoutesOfElements = (routes: RouteObject[]): RouteObject[] => {
  const cleanRoute = (route: RouteObject): RouteObject => {
    const { element, children, ...rest } = route;
    const cleanedRoute: RouteObject = { ...rest };

    if (children) {
      cleanedRoute.children = children.map(cleanRoute);
    }

    return cleanedRoute;
  };

  return routes.map(cleanRoute);
};

// ======================================================================== //

export const cleanRoutesOfProps = <T extends RouteObject[] | RouteConfig[]>({
  routes,
  props = ['element', 'children'],
}: {
  routes: T;
  props?: string[];
}): Partial<T[number]>[] => {
  const cleanRoute = (route: T[number]): T[number] => {
    const cleanedRoute: T[number] = { ...route };

    if ('children' in cleanedRoute) {
      if (Array.isArray(cleanedRoute.children) && cleanedRoute.children.length > 0) {
        cleanedRoute.children.map(cleanRoute);
      }
      delete cleanedRoute.children;
    }

    for (const prop of props.filter((p) => p !== 'children') as (keyof T[number])[]) {
      if (prop in cleanedRoute) {
        delete cleanedRoute[prop];
      }
    }

    return cleanedRoute;
  };

  return cloneDeep(routes).map(cleanRoute);
};
