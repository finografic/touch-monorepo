import { useOrders } from 'providers/OrdersProvider';
import { PATHS, ROUTES_CONFIG } from 'routes/routes.config';
import type { RoutePath } from 'routes/routes.types';
import { useMemo } from 'react';
import type { OrderFilters } from 'types/filters.types';

/**
 * Hook to get available route pathnames based on the selected drink type.
 * If the selected drink type has subtypes, includes the subtype route.
 * Otherwise, filters it out.
 */
export const useRoutePathnamesByFilters = (): { pathnames: RoutePath[] } => {
  const { orders } = useOrders();

  return useMemo((): { pathnames: RoutePath[] } => {
    // Get base paths excluding dynamic routes
    const basePaths = ROUTES_CONFIG.map((route) => route.path) as RoutePath[];

    // Early return if no orders or no drink type filter
    const filters = orders[0]?.filters as OrderFilters | undefined;
    const drinkType = filters?.drinkType;
    if (!drinkType) {
      return {
        pathnames: basePaths.filter((path) => path !== PATHS.drinkSubtype),
      };
    }

    // If drink type has subtypes, include the subtype route with the correct ID
    if (drinkType.hasSubtypes && drinkType.id) {
      return {
        pathnames: basePaths.map((path) =>
          path === PATHS.drinkSubtype ? PATHS.drinkSubtype.replace(':drinkTypeId', drinkType.id) : path,
        ),
      };
    }

    // Otherwise, filter out the subtype route
    return {
      pathnames: basePaths.filter((path) => path !== PATHS.drinkSubtype) as RoutePath[],
    };
  }, [orders]);
};
