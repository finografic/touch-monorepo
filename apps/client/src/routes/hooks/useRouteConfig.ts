import type { UIMatch } from 'react-router-dom';
import { useLocation, useMatches, useRouteLoaderData } from 'react-router-dom';
import type { RouteConfig } from 'routes/routes.types';
import { OrderFieldKeys } from 'src/config/app.config';
import type { FilterKey } from 'src/config/app.config';
import { PADS_UI_CONFIG } from 'src/config/ui.config';
import type { OrderFieldKey } from 'types/orders.types';
import { hasOptionalProperties } from 'types/utilities/object.utils.types';
import { useMemo } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import type { DataEntry } from 'types/data.types';
import type { PadConfig } from 'types/ui.types';

// First define the required (non-undefined) version
interface RequiredRouteConfig<T = DataEntry[]> {
  route: RouteConfig;
  fieldKey: OrderFieldKey;
  filterKey: FilterKey | undefined;
  loaderData: T;
  padsConfig: PadConfig;
}

// Then define the partial version separately (not derived from RequiredRouteConfig)
interface PartialRouteConfig<T = DataEntry[]> {
  route: RouteConfig | undefined;
  fieldKey: OrderFieldKey | undefined;
  loaderData: T | undefined;
  padsConfig: PadConfig | undefined;
}

export function useRouteConfig<T = DataEntry[]>(): RequiredRouteConfig<T> {
  const { routesMetadata } = useRouteLoaderData('routes') as { routesMetadata: RouteConfig[] };
  const location = useLocation();
  const matches = useMatches();

  const routeConfig = useMemo(() => {
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

  const fieldKey = routeConfig.fieldKey as OrderFieldKey;
  const padsConfig = PADS_UI_CONFIG[fieldKey];
  const loaderData = useRouteLoaderData(fieldKey || 'root') as T | undefined;
  const result = { ...routeConfig, loaderData, fieldKey, padsConfig } as PartialRouteConfig<T>;

  // Check if we have all required fields
  if (!hasOptionalProperties(result as unknown as Record<keyof PartialRouteConfig<T>, unknown>)) {
    // Only return RequiredRouteConfig if we also have loaderData
    if (result.loaderData !== undefined) {
      return {
        route: result.route,
        fieldKey: result.fieldKey,
        filterKey: result.padsConfig?.filterKey,
        // ...(result.padsConfig?.filterKey && { filterKey: result.padsConfig.filterKey }),
        loaderData: result.loaderData,
        padsConfig: result.padsConfig,
      } as RequiredRouteConfig<T>;
    }
  }

  return result as RequiredRouteConfig<T>;
}
