import type { RouteObject } from 'react-router-dom';
import type { RouteConfig } from 'routes/router.types';

const generatePathname = (path: string, parentPath: string = ''): string => {
  const fullPath = path === '/' ? '/' : `${parentPath}/${path}`.replace(/\/+/g, '/');

  return fullPath;
};

// NOTE: ⭐🚀 this function transforms the routes tree, adding to each route:
// - the `pathname` props, which is the FULL path of the route
// - the metadata matched from `routesConfig`, setting it to the route `handle` prop
// The returned RoutObject[] routes tree is what sets use `createBrowserRouter`

// NOTE: 🎉👉🏻 Current route metadata then accessed with `routes/hooks/useRouteMetadata` hook,
// which leverages react-router's `useMatches` hook to retrieve the metadata from 'handle' prop.

export const transformRoutesWithMetadata = (
  routes: RouteObject[],
  routesConfig: RouteConfig[],
): RouteObject[] => {
  const findMetadataRecursively = (configs: RouteConfig[], pathname: string): RouteConfig | undefined => {
    for (const config of configs) {
      if (config.pathname === pathname) {
        return config;
      }
      if (config.children) {
        const matchedChild = findMetadataRecursively(config.children, pathname);
        if (matchedChild) {
          return matchedChild;
        }
      }
    }
    return undefined;
  };

  const traverseRoutes = (routes: RouteObject[], parentPath: string = ''): RouteObject[] => {
    return routes.map((route) => {
      const pathname = generatePathname(route.path, parentPath);
      const matchedMetadata = findMetadataRecursively(routesConfig, pathname);

      if (matchedMetadata) {
        // Create a shallow copy of matchedMetadata and omit the children and element.props properties
        const { children, element, ...metadataWithoutChildren } = matchedMetadata;
        route.handle = { ...route.handle, ...metadataWithoutChildren };
      }

      if (route.children) {
        route.children = traverseRoutes(route.children, pathname);
      }

      return route;
    });
  };

  return traverseRoutes(routes);
};
