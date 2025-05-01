import { ROUTE_ACTION_SLUGS } from 'routes/routes.config';

export const getPathSlug = (pathname: string, customSlug?: string): string | undefined => {
  const actionSegments = customSlug ? [...ROUTE_ACTION_SLUGS, customSlug] : ROUTE_ACTION_SLUGS;
  const segments = pathname
    .split('/')
    .filter((segment) => segment && !segment.startsWith(':') && !actionSegments.includes(segment));

  return segments.length > 0 ? segments[segments.length - 1] : undefined;
};
