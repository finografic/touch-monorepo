import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { UIMatch } from 'react-router-dom';
import { useMatches, useRouteLoaderData } from 'react-router-dom';

import type { RegionLocale } from '@workspace/i18n';
import cloneDeep from 'lodash/cloneDeep';

import { useRouteMatching } from 'routes/hooks/useRouteMatching';
import type { RouteConfig } from 'routes/routes.types';
import type { DataEntry } from 'types/data.types';
import type { FilterApiKey } from 'types/filters.types';
import type { FilterKey } from 'types/orders.types';
import type { PadConfig } from 'types/pads.types';

import { ROUTE_FILTER_KEYS } from 'config/app';
import { getPadsUIConfig } from 'config/ui';

// Required route config interface
interface RequiredRouteConfig<T = DataEntry[]> {
  route: RouteConfig;
  filterKey: FilterKey;
  filterApiKey: FilterApiKey;
  loaderData: T;
  padsConfig: PadConfig<DataEntry>;
}

export function useRouteConfig<T = DataEntry[]>(): RequiredRouteConfig<T> {
  const { routesMetadata } = useRouteLoaderData('routes') as { routesMetadata: RouteConfig[] };
  const { matchRoute, matchRouteById, currentPathname } = useRouteMatching();
  const matches = useMatches();
  const { i18n } = useTranslation();

  // Use i18n language directly as the source of truth
  const currentLanguage: RegionLocale = (i18n.language as RegionLocale) || 'es-ES';

  const routeConfig = useMemo(() => {
    let matchedConfig: RouteConfig | undefined;
    let filterKey: FilterKey | undefined;

    // NOTE: Strategy 1 - get the most specific match (last)
    const currentMatch = matches[matches.length - 1];
    if (currentMatch) {
      // Use shared route matching logic
      matchedConfig = matchRoute(routesMetadata, currentPathname);

      // If no path match, try ID match
      if (!matchedConfig) {
        matchedConfig = matchRouteById(routesMetadata, currentMatch.id);
      }

      filterKey = (matchedConfig?.id || currentMatch?.id) as FilterKey;
    }

    // NOTE: Strategy 2 - find first match with FilterKey (fallback)
    if (!matchedConfig) {
      const routeMatch = matches.find(
        (match: UIMatch) => match?.id && Object.values(ROUTE_FILTER_KEYS).includes(match?.id as FilterKey),
      );
      if (routeMatch) {
        matchedConfig = matchRouteById(routesMetadata, routeMatch.id);
        filterKey = filterKey || (routeMatch.id as FilterKey);
      }
    }

    // NOTE: safety copy
    const routeConfig = cloneDeep(matchedConfig);

    // NOTE: export RouteObject `handle` prop, if present..
    if (routeConfig?.handle) {
      const { handle, ...configExpanded } = routeConfig;
      Object.assign(configExpanded, { ...handle });
      return { route: configExpanded, filterKey };
    }

    return { route: routeConfig, filterKey };
  }, [matches, routesMetadata, currentPathname, matchRoute, matchRouteById]);

  // Get language-aware pads configuration
  const padsConfig = useMemo(() => {
    if (!routeConfig.filterKey) return undefined;

    const currentRoute = routeConfig.route;
    const languageCode = currentLanguage.startsWith('es')
      ? 'es'
      : currentLanguage.startsWith('ca')
        ? 'ca'
        : 'en';

    const allPadsConfig = getPadsUIConfig(languageCode);
    return allPadsConfig[routeConfig.filterKey];
  }, [routeConfig.filterKey, currentLanguage, routeConfig.route]);

  // Call useRouteLoaderData at the top level (not inside useMemo!)
  const loaderData = useRouteLoaderData(routeConfig.filterKey || 'root') as T;

  // Build the result with all required properties
  const result: RequiredRouteConfig<T> = {
    route: routeConfig.route || ({} as RouteConfig),
    filterKey: routeConfig.filterKey || ('' as FilterKey),
    filterApiKey: padsConfig?.filterApiKey || ('' as FilterApiKey),
    // loaderData: loaderData || ([] as unknown as T),
    loaderData,
    padsConfig: padsConfig || ({} as PadConfig<DataEntry>),
  };

  return result;
}
