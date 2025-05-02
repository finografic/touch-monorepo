import type { RouteObject, UIMatch } from 'react-router-dom';
import { useLocation, useMatches, useRouteLoaderData } from 'react-router-dom';
import { useRouteMetadata } from 'routes/providers/RouteMetadataContext';
import type { RouteConfig } from 'routes/routes.types';
import { flatttenChildren } from 'routes/utils/routes.utils.flatten';
import cloneDeep from 'lodash/cloneDeep';
import { NUM_SLOTS_TYPE_B, OrderFieldKeys } from 'constants/app.config';
import type { OrderFieldKey } from 'types/orders.types';
import type { OverridePropTypes } from 'types/utilities/object.utils.types';
import { useMemo } from 'react';

const assertMatchConfig = (match: UIMatch) =>
  match?.id && Object.values(OrderFieldKeys).includes(match?.id as OrderFieldKey);

export const useRouteConfig = (): { route: RouteConfig | undefined } => {
  const { routes, routesMetadata } = useRouteLoaderData('routes') as {
    routes: RouteObject[];
    routesMetadata: RouteConfig[];
  };

  const location = useLocation();
  const matches = useMatches();

  const routeMatch = matches.find(assertMatchConfig) as OverridePropTypes<RouteConfig, { id: OrderFieldKey }>;
  const currentFieldKey = routeMatch?.id;

  // Get the last match which corresponds to the current route
  const currentMatch = matches[matches.length - 1];

  // log('__TEST', 'blue', routeData);

  // Find the corresponding route object from our enhanced routes
  const routeConfig = currentMatch
    ? routesMetadata.find((r) => !!(r.id === currentMatch.id || r.pathname === location.pathname))
    : undefined;

  // const route = routeConfig?.handle;

  log('__ROUTES - 0', 'yellow', routeMatch, currentMatch);
  log('__ROUTES - 1', 'red', { currentFieldKey, routes, routesMetadata });
  log('__ROUTES - 2', 'red', routeConfig);

  // const route = useMemo((): RouteConfig => {
  //   // log('LOADER_DATA', 'hotpink', { loaderData });

  //   return {
  //     fieldKey: currentFieldKey as OrderFieldKey,
  //     numSlots: NUM_SLOTS_TYPE_B,
  //     numPads,
  //     pads: initPadItems({ numPads, keys: [], type: 'radio' }),
  //   };
  // }, [currentFieldKey, loaderData, numPads]);

  // if (currentRoute) {

  return { route: routeConfig };
};
