import type { RouteObject } from 'react-router-dom';
import { createContext, useContext, useMemo } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { flatttenChildren } from 'routes/utils/routes.utils.flatten';
import { cleanRoutesOfProps } from 'routes/utils/routes.utils';
// import { useLocation, useMatches } from 'react-router-dom';
// import type { RouteConfig } from 'routes/routea.types';

interface RouteMetadataContextValues {
  routes: RouteObject[];
  routesMetadata: RouteObject[];
  isInitialized: boolean;
  // route?: RouteObject & RouteConfig;
}

export const RouteMetadataContext = createContext<RouteMetadataContextValues>({
  // route: undefined,
  routes: [],
  routesMetadata: [],
  isInitialized: false,
});

/**
 * Hook to access enhanced routes information and metadata.
 * Provides access to all routes and the current route with its metadata.
 */
export const useRouteMetadata = (): RouteMetadataContextValues => {
  const context = useContext(RouteMetadataContext);
  // const matches = useMatches();

  log('__CONTEXT', 'magenta', context);

  // Get the last match which corresponds to the current route
  // const currentMatch = matches[matches.length - 1];

  // Find the corresponding route object from our enhanced routes
  // const currentRoute = currentMatch ? context.routes.find((r) => r.id === currentMatch.id) : undefined;

  const routesMetadata = useMemo((): Partial<RouteObject>[] => {
    const flattened = flatttenChildren<RouteObject>(cloneDeep(context.routesMetadata) as RouteObject[]);

    return cleanRoutesOfProps<RouteObject[]>({ routes: flattened, props: ['element', 'children'] });
  }, [context.routes]);

  return {
    ...context,
    routesMetadata,
    // route: currentRoute
    // ? {
    //     ...currentRoute,
    //     pathname: location.pathname,
    //   }
    // : undefined,
  };
};
