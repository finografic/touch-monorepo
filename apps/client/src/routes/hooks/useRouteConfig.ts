import type { UIMatch } from 'react-router-dom';
import { useLocation, useMatches, useRouteLoaderData } from 'react-router-dom';
import type { RouteConfig } from 'routes/routes.types';
import { OrderFieldKeys } from 'constants/app.config';
import { getPadsUIConfig } from 'constants/ui-V2.config';
import type { OrderFieldKey } from 'types/orders.types';
import { useMemo } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import type { DataEntry } from 'types/data.types';
import type { PadConfig } from 'types/ui.types';
import type { FilterKey } from 'types/filters.types';
import { useTranslation } from 'react-i18next';
import type { RegionLocale } from '@workspace/core/types';

// Required route config interface
interface RequiredRouteConfig<T = DataEntry[]> {
  route: RouteConfig;
  fieldKey: OrderFieldKey;
  filterKey: FilterKey;
  loaderData: T;
  padsConfig: PadConfig<DataEntry>;
}

export function useRouteConfig<T = DataEntry[]>(): RequiredRouteConfig<T> {
  const { routesMetadata } = useRouteLoaderData('routes') as { routesMetadata: RouteConfig[] };
  const location = useLocation();
  const matches = useMatches();
  const { i18n } = useTranslation();

  // Use i18n language directly as the source of truth
  const currentLanguage: RegionLocale = (i18n.language as RegionLocale) || 'es-ES';

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
    fieldKey: routeConfig.fieldKey || ('' as OrderFieldKey),
    filterKey: padsConfig?.filterKey || ('' as FilterKey),
    loaderData: loaderData || ([] as unknown as T),
    padsConfig: padsConfig || ({} as PadConfig<DataEntry>),
  };

  return result;
}
