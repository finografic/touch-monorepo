import type { RouteObject } from 'react-router-dom';
import { ROUTE_ACTION_SLUGS } from 'routes/routes.config';

export const generatePathname = (path: string | undefined, parentPath: string = ''): string => {
  if (!path) return parentPath || '/';
  return path === '/' ? '/' : `${parentPath}/${path}`.replace(/\/+/g, '/');
};

export const getPathSlug = (pathname: string, customSlug?: string): string | undefined => {
  const actionSegments = customSlug ? [...ROUTE_ACTION_SLUGS, customSlug] : ROUTE_ACTION_SLUGS;
  const segments = pathname
    .split('/')
    .filter((segment) => segment && !segment.startsWith(':') && !actionSegments.includes(segment));

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
