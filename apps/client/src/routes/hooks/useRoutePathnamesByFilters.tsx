import { useOrders } from 'providers/OrdersProvider';
import { PATHS, ROUTES_CONFIG } from 'routes/routes.config';
import type { RoutePath } from 'routes/routes.types';
import { useMemo } from 'react';
import { useRouteMetadata } from 'routes/providers/RouteMetadataContext';

export const useRoutePathnamesByFilters = (): { pathnames: RoutePath[] } => {
  const { routes } = useRouteMetadata();
  const { orders } = useOrders();

  const filters = useMemo((): { hasSubtypes: boolean; drinkTypeId: string } => {
    const filters = orders[0]?.filters;
    if (filters) {
      const hasSubtypes = !!filters.drinkType?.hasSubtypes;
      const drinkTypeId = (filters.drinkType as any)?.id || '';
      return { hasSubtypes, drinkTypeId };
    }
    return { hasSubtypes: false, drinkTypeId: '' };
  }, [orders]);

  const pathnames = useMemo((): RoutePath[] => {
    const paths = ROUTES_CONFIG.map((route) => route.path) as RoutePath[];

    if (filters.hasSubtypes && filters.drinkTypeId) {
      return paths.map((path: RoutePath) =>
        path === PATHS.drinkSubtype
          ? PATHS.drinkSubtype.replace(':drinkTypeId', filters.drinkTypeId as string)
          : path,
      );
    }
    return paths.filter((path: RoutePath) => path !== PATHS.drinkSubtype);
  }, [filters, routes]);

  return { pathnames };
};
