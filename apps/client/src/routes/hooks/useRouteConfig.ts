import type { UIMatch } from 'react-router-dom';
import { useLocation, useMatches, useRouteLoaderData } from 'react-router-dom';
import type { RouteConfig } from 'routes/routes.types';
import { OrderFieldKeys } from 'constants/app.config';
import type { OrderFieldKey } from 'types/orders.types';
import type { OverridePropTypes } from 'types/utilities/object.utils.types';
import { useMemo } from 'react';
import cloneDeep from 'lodash/cloneDeep';

interface UseRouteConfigReturn {
  route: RouteConfig | undefined;
  fieldKey: OrderFieldKey | undefined;
}

export const useRouteConfig = (): UseRouteConfigReturn => {
  const { routesMetadata } = useRouteLoaderData('routes') as { routesMetadata: RouteConfig[] };

  const location = useLocation();
  const matches = useMatches();

  const routeConfig = useMemo((): UseRouteConfigReturn => {
    let matchedConfig: RouteConfig | undefined;
    let fieldKey: OrderFieldKey | undefined;

    // NOTE: Strategy 1 - get the most specific match (last)
    const currentMatch = matches[matches.length - 1];
    if (currentMatch) {
      matchedConfig = routesMetadata.find(
        (r) => !!(r.pathname === location.pathname || r.id === currentMatch.id),
      );
      fieldKey = (matchedConfig?.id || currentMatch?.id) as OrderFieldKey;
    }

    // NOTE: Strategy 2 - find first match with OrderFieldKey (fallback)
    if (!matchedConfig) {
      const routeMatch = matches.find(
        (match: UIMatch) => match?.id && Object.values(OrderFieldKeys).includes(match?.id as OrderFieldKey),
      ) as OverridePropTypes<RouteConfig, { id: OrderFieldKey }>;
      if (routeMatch) {
        matchedConfig = routesMetadata.find((r) => r.id === routeMatch.id);
        fieldKey = fieldKey || (routeMatch.id as OrderFieldKey);
      }
    }

    // NOTE: safety copy
    const routeConfig = cloneDeep(matchedConfig);

    // NOTE: export RouteObject `handle` prop, if present..
    if (routeConfig?.handle) {
      const { handle, ...configExpanded } = routeConfig;
      Object.assign(configExpanded, { ...handle });
      return { route: configExpanded, fieldKey };
    }

    return { route: routeConfig, fieldKey };
  }, [matches, routesMetadata, location.pathname]);

  return { fieldKey: routeConfig?.fieldKey, route: routeConfig?.route };
};
