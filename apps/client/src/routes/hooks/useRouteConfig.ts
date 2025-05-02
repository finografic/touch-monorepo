import type { RouteObject } from 'react-router-dom';
import { useLocation, useMatches, useRouteLoaderData } from 'react-router-dom';
import { useRouteMetadata } from 'routes/providers/RouteMetadataContext';
import type { RouteConfig } from 'routes/routes.types';
import { flatttenChildren } from 'routes/utils/routes.utils.flatten';
import cloneDeep from 'lodash/cloneDeep';
import { OrderFieldKeys } from 'constants/app.config';
import type { OrderFieldKey } from 'types/orders.types';

export const useRouteConfig = (): RouteConfig | undefined => {
  const { routes, routesMetadata } = useRouteLoaderData('routes') as {
    routes: RouteObject[];
    routesMetadata: RouteConfig[];
  };

  const location = useLocation();
  const matches = useMatches();
  const routeMatch = matches.find(
    (match) => match.id && Object.values(OrderFieldKeys).includes(match.id as OrderFieldKey),
  );
  const currentFieldKey = routeMatch?.id as OrderFieldKey | undefined;

  // const { routes } = useRouteMetadata();
  // const routeData = useRouteLoaderData('routes');
  // const routeConfigs = cloneDeep(routes ?? []) as RouteObject[];
  // const routesMetadata = flatttenChildren<RouteObject>(routeConfigs);

  // Get the last match which corresponds to the current route
  const currentMatch = matches[matches.length - 1];

  // log('__TEST', 'blue', routeData);

  // Find the corresponding route object from our enhanced routes
  const currentRoute = currentMatch
    ? routesMetadata.find((r) => !!(r.id === currentMatch.id || r.pathname === location.pathname))
    : undefined;

  log('__ROUTES - 1', 'red', { currentFieldKey, routes, routesMetadata });

  log('__ROUTES - 2', 'red', currentRoute);

  // if (currentRoute) {

  return currentRoute
    ? ({
        ...currentRoute,
        pathname: currentMatch.pathname ?? location.pathname,
      } as RouteConfig)
    : undefined;
};
