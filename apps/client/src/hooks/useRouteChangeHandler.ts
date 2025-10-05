import { useEffect, useMemo, useRef } from 'react';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useFilters } from 'providers/FiltersProvider/useFilters';
import { useOrders } from 'providers/OrdersProvider';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import type { RegionLocale } from '@workspace/i18n';
import type { DataEntry } from 'types/data.types';
import type { OrderModel } from 'types/models/order.model';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { OrderFilters } from 'types/filters.types';

/**
 * Hook to handle route changes and sync filters
 * Separated from useRouteConfig to avoid circular dependencies
 * Now uses the new useFiltersWithData hook for orders_readable support
 */
export const useRouteChangeHandler = () => {
  const { handleRouteChange } = useLayoutUi();
  const { currentSessionId, sessions } = useSession();
  const { dataPool, filters } = useFilters();
  const { setFilters: setOrdersFilters } = useOrders();
  const { fieldKey, loaderData, padsConfig } = useRouteConfig();

  // Track route changes to prevent unnecessary re-renders
  const lastRouteDataRef = useRef<{
    fieldKey?: string;
    loaderDataLength?: number;
    dataPoolLength?: number;
    sessionId?: string;
    language?: string;
  }>({});

  // Handle route changes (consolidated from LayoutUiObserver)
  useEffect(() => {
    const currentRouteData = {
      fieldKey: fieldKey || '',
      loaderDataLength: loaderData?.length || 0,
      dataPoolLength: dataPool?.length || 0,
      sessionId: currentSessionId || '',
      language: 'es-ES', // Use default language to avoid i18n dependency
    };

    // Only trigger if route data actually changed
    const hasRouteChanged =
      lastRouteDataRef.current.fieldKey !== currentRouteData.fieldKey ||
      lastRouteDataRef.current.loaderDataLength !== currentRouteData.loaderDataLength ||
      lastRouteDataRef.current.dataPoolLength !== currentRouteData.dataPoolLength ||
      lastRouteDataRef.current.sessionId !== currentRouteData.sessionId ||
      lastRouteDataRef.current.language !== currentRouteData.language;

    if (hasRouteChanged) {
      lastRouteDataRef.current = currentRouteData;

      // Build session server field map
      const sessionFilters =
        currentSessionId && sessions[currentSessionId] ? sessions[currentSessionId].filters : {};

      /*
      // NOTE: V1 - NOT WORKING !!
      const sessionServerFieldMap = Object.entries(sessionFilters).reduce(
        (acc, [filterKey, filterValue]) => {
          if (filterValue && typeof filterValue === 'object' && 'name' in filterValue) {
            return { ...acc, [filterKey as string]: filterValue.name };
          }
          return acc;
        },
        {} as Record<string, string>,
      );
      */

      // NEW: V2 -- WE WANT TO USE sessionFilters, AS IN V1 --or-- filters ??
      const sessionServerFieldMap = Object.entries(sessionFilters).reduce(
        // const sessionServerFieldMap = Object.entries(filters).reduce(
        (acc, [filterKey, filterValue]) => {
          if (filterKey in filters) {
            return { ...acc, [filterKey as string]: filterValue.name };
          }
          return acc;
        },
        {} as Record<string, string>,
      );

      // Handle route change
      if (!fieldKey) {
        handleRouteChange(undefined, [], {} as any, [], {});
        return;
      }

      try {
        if (loaderData && padsConfig && dataPool) {
          handleRouteChange(
            fieldKey,
            loaderData as DataEntry[],
            padsConfig,
            dataPool as DataEntry[] | OrderModel[] | OrderReadableModel[],
            sessionServerFieldMap,
            'es-ES' as RegionLocale,
          );
        } else {
          handleRouteChange(fieldKey, [], {} as any, [], {});
        }
      } catch (error) {
        console.error('useRouteChangeHandler: Error handling route change:', error);
      }
    }
  }, [fieldKey, loaderData, padsConfig, dataPool, currentSessionId, sessions]); // Removed handleRouteChange to prevent infinite loop

  // Sync filters from useFilters to OrdersContext (consolidated from LayoutUiObserver)
  useEffect(() => {
    // TODO: IS THIS STILL NECESSARY ??????
    if (filters && Object.keys(filters).length > 0) {
      setOrdersFilters(filters);
    }
  }, [filters, setOrdersFilters]);
};
