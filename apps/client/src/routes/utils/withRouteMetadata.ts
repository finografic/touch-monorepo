import type { RouteObject } from 'react-router-dom';
import type { RouteConfig } from 'routes/routes.types';
import { generatePathname } from 'routes/utils/routes.utils';

/**
 * Transforms a routes tree by computing full pathnames and adding metadata to route.handle
 *
 * @param routes - The original react-router RouteObject tree
 * @param routesConfig - The metadata configuration tree
 * @returns - Enhanced RouteObject tree with computed pathnames and metadata in handle prop
 */

export const withRouteMetadata = (routes: RouteObject[], routesConfig: RouteConfig[]): RouteObject[] => {
  // NOTE: 1. initalize fast lookup-by-pathname map for route metadata
  const metadataMap = new Map<string, Omit<RouteConfig, 'children' | 'element'>>();

  // NOTE: 2a. build the metadata lookup map once
  const buildMetadataMap = (configs: RouteConfig[], parentPath: string = '') => {
    configs.forEach((config) => {
      const pathname = generatePathname(config.path, parentPath);

      const { children, element, ...metadata } = config;
      metadataMap.set(pathname, metadata);

      if (children?.length) {
        buildMetadataMap(children, pathname);
      }
    });
  };

  // NOTE: 2b. build the full metadata lookup map
  buildMetadataMap(routesConfig);

  // NOTE: 3. recursively traverse and enhance routes with metadata
  const traverseRoutes = (routes: RouteObject[], parentPath: string = ''): RouteObject[] => {
    return routes.map((route) => {
      const pathname = generatePathname(route.path, parentPath);

      const metadata = metadataMap.get(pathname);

      if (metadata) {
        log('PATHNAME', 'orange', { metadata });
        route.handle = { ...route.handle, ...metadata };
      }

      if (route.children?.length) {
        route.children = traverseRoutes(route.children, pathname);
      }

      return route;
    });
  };

  return traverseRoutes(routes);
};
