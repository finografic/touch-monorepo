import { ROUTE_ACTION_SLUGS } from 'config/routes';

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

export const getPathnameClassName = ({ pathname }: { pathname: string }): string => {
  if (pathname === '/') {
    return 'main';
  }

  return pathname.split('/').filter(Boolean).join('--').toLowerCase();
};
