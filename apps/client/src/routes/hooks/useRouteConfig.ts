import type { UIMatch } from 'react-router-dom';
import { useLocation, useMatches, useRouteLoaderData } from 'react-router-dom';
import type { RouteConfig } from 'routes/routes.types';
import { ROUTE_FILTER_KEYS } from 'config/app';
import { getPadsUIConfig } from 'config/ui';
import type { FilterFieldKey } from 'types/orders.types';
import { useMemo } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import type { DataEntry } from 'types/data.types';
import type { PadConfig } from 'types/pads.types';
import type { FilterApiKey } from 'types/filters.types';
import { useTranslation } from 'react-i18next';
import type { RegionLocale } from '@workspace/i18n';
import { useRouteMatching } from 'routes/hooks/useRouteMatching';

// Required route config interface
interface RequiredRouteConfig<T = DataEntry[]> {
  route: RouteConfig;
  fieldKey: FilterFieldKey;
  filterKey: FilterApiKey;
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
    let fieldKey: FilterFieldKey | undefined;

    // NOTE: Strategy 1 - get the most specific match (last)
    const currentMatch = matches[matches.length - 1];
    if (currentMatch) {
      // Use shared route matching logic
      matchedConfig = matchRoute(routesMetadata, currentPathname);

      // If no path match, try ID match
      if (!matchedConfig) {
        matchedConfig = matchRouteById(routesMetadata, currentMatch.id);
      }

      fieldKey = (matchedConfig?.id || currentMatch?.id) as FilterFieldKey;
    }

    // NOTE: Strategy 2 - find first match with FilterFieldKey (fallback)
    if (!matchedConfig) {
      const routeMatch = matches.find(
        (match: UIMatch) =>
          match?.id && Object.values(ROUTE_FILTER_KEYS).includes(match?.id as FilterFieldKey),
      );
      if (routeMatch) {
        matchedConfig = matchRouteById(routesMetadata, routeMatch.id);
        fieldKey = fieldKey || (routeMatch.id as FilterFieldKey);
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
  }, [matches, routesMetadata, currentPathname, matchRoute, matchRouteById]);

  // Get language-aware pads configuration
  const padsConfig = useMemo(() => {
    if (!routeConfig.fieldKey) return undefined;

    const currentRoute = routeConfig.route;
    const languageCode = currentLanguage.startsWith('es')
      ? 'es'
      : currentLanguage.startsWith('ca')
        ? 'ca'
        : 'en';

    const allPadsConfig = getPadsUIConfig(languageCode);
    return allPadsConfig[routeConfig.fieldKey];
  }, [routeConfig.fieldKey, currentLanguage, routeConfig.route]);

  // Call useRouteLoaderData at the top level (not inside useMemo!)
  const loaderData = useRouteLoaderData(routeConfig.fieldKey || 'root') as T;

  // Build the result with all required properties
  const result: RequiredRouteConfig<T> = {
    route: routeConfig.route || ({} as RouteConfig),
    fieldKey: routeConfig.fieldKey || ('' as FilterFieldKey),
    filterKey: padsConfig?.filterKey || ('' as FilterApiKey),
    loaderData: loaderData || ([] as unknown as T),
    padsConfig: padsConfig || ({} as PadConfig<DataEntry>),
  };

  return result;
}
