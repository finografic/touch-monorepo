import type { UIMatch } from 'react-router-dom';
import { useLocation, useMatches, useRouteLoaderData } from 'react-router-dom';
import type { RouteConfig } from 'routes/routes.types';
import { OrderFieldKeys } from 'src/config/app.config';
import type { OrderFieldKey } from 'types/orders.types';
import { hasOptionalProperties } from 'types/utilities/object.utils.types';
import type { RequiredProp } from 'types/utilities/props.utils.types';
import { useMemo } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import type { DataEntry } from 'types/data.types';

// Base interface with all optional properties
interface BaseRouteConfig {
  route: RouteConfig | undefined;
  fieldKey: OrderFieldKey | undefined;
  loaderData: unknown;
}

// Type for the hook return value that handles array vs non-array types
interface UseRouteConfigReturn<T = DataEntry[]> {
  route: RouteConfig | undefined;
  fieldKey: OrderFieldKey | undefined;
  loaderData: T extends any[] ? T : T | undefined;
}

type RequiredRouteConfig<T = DataEntry[]> = RequiredProp<UseRouteConfigReturn<T>, 'route' | 'fieldKey'>;

export function useRouteConfig<T = DataEntry[]>(): UseRouteConfigReturn<T> | RequiredRouteConfig<T> {
  const { routesMetadata } = useRouteLoaderData('routes') as { routesMetadata: RouteConfig[] };

  const location = useLocation();
  const matches = useMatches();

  const routeConfig = useMemo((): BaseRouteConfig => {
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
      return { route: configExpanded, fieldKey, loaderData: undefined };
    }

    return { route: routeConfig, fieldKey, loaderData: undefined };
  }, [matches, routesMetadata, location.pathname]);

  const loaderData = useRouteLoaderData(routeConfig.fieldKey || 'root') as T | undefined;
  const result = { ...routeConfig, loaderData } as UseRouteConfigReturn<T>;

  // Check if we have all required fields
  const hasRequiredFields = !hasOptionalProperties({ route: result.route, fieldKey: result.fieldKey });

  // If we have all required fields, return the full type
  if (hasRequiredFields) {
    return {
      ...result,
      route: result.route,
      fieldKey: result.fieldKey,
    } as RequiredRouteConfig<T>;
  }

  // Otherwise return the partial result
  return result;
}
