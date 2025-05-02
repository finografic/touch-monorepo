import type { UIMatch } from 'react-router-dom';
import { useLocation, useMatches, useRouteLoaderData } from 'react-router-dom';
import type { RouteConfig } from 'routes/routes.types';
import { OrderFieldKeys } from 'constants/app.config';
import type { OrderFieldKey } from 'types/orders.types';
import type { OverridePropTypes } from 'types/utilities/object.utils.types';
import { useMemo } from 'react';
import cloneDeep from 'lodash/cloneDeep';

export const useRouteConfig = (): { route: RouteConfig | undefined } => {
  const { routesMetadata } = useRouteLoaderData('routes') as { routesMetadata: RouteConfig[] };

  const location = useLocation();
  const matches = useMatches();

  const routeConfig = useMemo(() => {
    // NOTE: Strategy 1 - get the most specific match (last)
    const currentMatch = matches[matches.length - 1];
    let matchedConfig = currentMatch
      ? routesMetadata.find((r) => !!(r.id === currentMatch.id || r.pathname === location.pathname))
      : undefined;

    // NOTE: Strategy 2 - find first match with OrderFieldKey (fallback)
    if (!matchedConfig) {
      const routeMatch = matches.find(
        (match: UIMatch) => match?.id && Object.values(OrderFieldKeys).includes(match?.id as OrderFieldKey),
      ) as OverridePropTypes<RouteConfig, { id: OrderFieldKey }>;
      if (routeMatch) {
        matchedConfig = routesMetadata.find((r) => r.id === routeMatch.id);
      }
    }

    const routeConfig = cloneDeep(matchedConfig);

    // NOTE: export RouteObject `handle` prop, if present..
    if (routeConfig?.handle) {
      const { handle, ...configExpanded } = routeConfig;
      Object.assign(configExpanded, { ...handle });
      return configExpanded;
    }

    return routeConfig;
  }, [matches, routesMetadata, location.pathname]);

  return { route: routeConfig };
};
