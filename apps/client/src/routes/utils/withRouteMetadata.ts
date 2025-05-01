import type { RouteObject } from 'react-router-dom';
import type { RouteConfig } from 'routes/router.types';

const generatePathname = (path: string | undefined, parentPath: string = ''): string => {
  if (!path) return parentPath || '/';
  return path === '/' ? '/' : `${parentPath}/${path}`.replace(/\/+/g, '/');
};

/**
 * Transforms a routes tree by computing full pathnames and adding metadata to route.handle
 *
 * @param routes - The original react-router RouteObject tree
 * @param routesConfig - The metadata configuration tree
 * @returns - Enhanced RouteObject tree with computed pathnames and metadata in handle prop
 */
export const withRouteMetadata = (routes: RouteObject[], routesConfig: RouteConfig[]): RouteObject[] => {
  // Create a fast lookup map for route metadata using pathnames
  const metadataMap = new Map<string, Omit<RouteConfig, 'children' | 'element'>>();

  const buildMetadataMap = (configs: RouteConfig[], parentPath: string = '') => {
    configs.forEach((config) => {
      // Compute the full pathname for this config
      const pathname = generatePathname(config.path, parentPath);

      // Store metadata without children/element
      const { children, element, ...metadata } = config;
      metadataMap.set(pathname, metadata);

      // Recursively process children
      if (children?.length) {
        buildMetadataMap(children, pathname);
      }
    });
  };

  // Build the metadata lookup map once
  buildMetadataMap(routesConfig);

  const traverseRoutes = (routes: RouteObject[], parentPath: string = ''): RouteObject[] => {
    return routes.map((route) => {
      // Compute the full pathname for this route
      const pathname = generatePathname(route.path, parentPath);

      // Look up metadata for this pathname
      const metadata = metadataMap.get(pathname);

      if (metadata) {
        // Merge metadata into route.handle
        route.handle = { ...route.handle, ...metadata };
      }

      // Process children if they exist
      if (route.children?.length) {
        route.children = traverseRoutes(route.children, pathname);
      }

      return route;
    });
  };

  return traverseRoutes(routes);
};
