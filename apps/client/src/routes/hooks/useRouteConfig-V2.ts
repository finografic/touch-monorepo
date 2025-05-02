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

  const route = useMemo(() => {
    // Strategy 1: Get the most specific (last) match
    const currentMatch = matches[matches.length - 1];
    let routeConfig = currentMatch
      ? routesMetadata.find((r) => !!(r.id === currentMatch.id || r.pathname === location.pathname))
      : undefined;

    // Strategy 2 (Fallback): Find first match with OrderFieldKey
    if (!routeConfig) {
      const routeMatch = matches.find(assertMatchConfig) as OverridePropTypes<
        RouteConfig,
        { id: OrderFieldKey }
      >;
      if (routeMatch) {
        routeConfig = routesMetadata.find((r) => r.id === routeMatch.id);
      }
    }

    return routeConfig;
  }, [matches, routesMetadata, location.pathname]);

  return { route };
};
