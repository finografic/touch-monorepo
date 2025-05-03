import type { UIMatch } from 'react-router-dom';
import { useLocation, useMatches, useRouteLoaderData } from 'react-router-dom';
import type { RouteConfig } from 'routes/routes.types';
import { OrderFieldKeys } from 'src/config/app.config';
import type { OrderFieldKey } from 'types/orders.types';
import { hasOptionalProperties } from 'types/utilities/object.utils.types';
import type { RequiredProp } from 'types/utilities/props.utils.types';
import { useMemo } from 'react';
import cloneDeep from 'lodash/cloneDeep';

interface UseRouteConfigReturn {
  route: RouteConfig | undefined;
  fieldKey: OrderFieldKey | undefined;
}

type RequiredRouteConfig = RequiredProp<UseRouteConfigReturn, 'route' | 'fieldKey'>;

export function useRouteConfig(): RequiredRouteConfig;
export function useRouteConfig(allowPartial: true): UseRouteConfigReturn;
export function useRouteConfig(allowPartial?: boolean): UseRouteConfigReturn | RequiredRouteConfig {
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
      );
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

  const result = { route: routeConfig.route, fieldKey: routeConfig.fieldKey };

  // If allowPartial is true, return the potentially partial result
  if (allowPartial) return result;

  // Otherwise, verify we have complete data
  if (hasOptionalProperties(result)) {
    throw new Error('Route configuration is incomplete - missing route or fieldKey');
  }

  return result as RequiredRouteConfig;
}
