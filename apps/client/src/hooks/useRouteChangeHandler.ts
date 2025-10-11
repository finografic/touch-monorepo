import { useEffect, useMemo, useRef } from 'react';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useFilters } from 'providers/FiltersProvider/useFilters';
import { useOrders } from 'providers/OrdersProvider';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { generateMockEntries } from './useRouteChangeHandler.utils';
import type { RegionLocale } from '@workspace/i18n';
import type { DataEntry } from 'types/data.types';
import type { OrderModel } from 'types/models/order.model';
import type { OrderReadableModel } from 'types/models/order-readable.model';

/**
 * Hook to handle route changes and sync filters
 * Separated from useRouteConfig to avoid circular dependencies
 * Now uses the new useFiltersWithData hook for orders_readable support
 */
export const useRouteChangeHandler = () => {
  const { handleRouteChange } = useLayoutUi();
  const { currentSessionId, sessions } = useSession();
  const { dataPool, dataFiltered, filters } = useFilters();
  const { setFilters: setOrdersFilters } = useOrders();
  const { fieldKey, loaderData, padsConfig } = useRouteConfig();

  const __TODO__proxyDataPool = useMemo((): OrderReadableModel[] => {
    // Edge case: If user clicks NEXT with current selection, next page will be EMPTY
    if (dataFiltered.length <= 1) {
      const mockEntries = generateMockEntries(filters);
      console.log('%c🚨 DATA POOL PROXY: No real data found, injecting mock entries', 'color:orange', [
        ...dataPool,
        ...mockEntries,
      ]);
      console.log('%c🚨 DATA POOL PROXY: Injected mock entries:', 'color:grey', mockEntries.length);

      return [...dataPool, ...mockEntries];
    }

    // Default: Use real filtered data
    console.log('%c🚨 DATA POOL PROXY: Using real data, no proxy needed', 'color:lime', dataFiltered);
    return dataFiltered;
  }, [dataPool, dataFiltered, filters]);

  // Track route changes to prevent unnecessary re-renders
  const lastRouteDataRef = useRef<{
    fieldKey?: string;
    loaderDataLength?: number;
    dataPoolLength?: number;
    sessionId?: string;
    language?: string;
  }>({});

  // Handle route changes (consolidated from LayoutUiObserver)
  useEffect(
    function handleRouteChanges() {
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

        const sessionServerFieldMap = Object.entries(sessionFilters).reduce(
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
    },
    [fieldKey, loaderData, padsConfig, dataPool, currentSessionId, sessions],
  );

  // Sync filters from useFilters to OrdersContext / SlotsContext
  useEffect(
    function syncFiltersToSlotsContext() {
      // TODO: IS THIS STILL NECESSARY ??????
      if (filters && Object.keys(filters).length > 0) {
        setOrdersFilters(filters);
      }
    },
    [filters, setOrdersFilters],
  );
};
