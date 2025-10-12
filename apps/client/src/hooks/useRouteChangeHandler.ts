import { useEffect, useMemo, useRef } from 'react';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useFilters } from 'providers/FiltersProvider/useFilters';
import { useOrders } from 'providers/OrdersProvider';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
// import { useDataPoolProxy } from './useDataPoolProxy'; // 🚨 COMMENTED OUT: Replaced with new ref system
import type { RegionLocale } from '@workspace/i18n';
import type { DataEntry } from 'types/data.types';
import type { OrderModel } from 'types/models/order.model';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { FilterKey } from 'types/orders.types';

enum CHANGED {
  INIT = 'initial-load',
  ROUTE = 'route-change',
  FILTERS = 'filter-update',
}

interface DataPoolTrackingState {
  filterKey: FilterKey;
  dataPool: OrderReadableModel[];
  previous: {
    filterKey: FilterKey;
    dataPool: OrderReadableModel[] | undefined;
  };
  trigger: CHANGED;
  timestamp: number;
}

/**
 * Hook to handle route changes and sync filters
 * Separated from useRouteConfig to avoid circular dependencies
 * Now uses the new useFiltersWithData hook for orders_readable support
 */
export const useRouteChangeHandler = () => {
  const { handleRouteChange } = useLayoutUi();
  const { currentSessionId, sessions } = useSession();
  const { data, dataPool, dataFiltered, filters } = useFilters();
  const { setFilters: setOrdersFilters } = useOrders();
  const { filterKey, loaderData, padsConfig } = useRouteConfig();

  // 🚨 ENHANCED DATA POOL TRACKING: Route-aware with change context
  const dataPoolRef = useRef<DataPoolTrackingState>();

  useEffect(
    function handle_DATA_POOL_CHANGE() {
      if (Array.isArray(loaderData)) {
        // 🚀 EXPERIMENTAL PATTERN - FOR CHANGE REASON DETERMINATION
        const trigger: CHANGED = (() => {
          if (!filterKey) return CHANGED.INIT;
          if (!dataPoolRef.current) return CHANGED.INIT;
          if (filterKey !== dataPoolRef.current.filterKey) return CHANGED.ROUTE;
          return CHANGED.FILTERS;
        })();

        // 🚀 ENAHNCED FACTORY - better defaults
        const createDataPoolState = (
          trigger: CHANGED,
          current: { filterKey: FilterKey; dataPool: OrderReadableModel[] },
        ): DataPoolTrackingState => ({
          filterKey: current.filterKey,
          dataPool: current.dataPool,
          previous: {
            filterKey: dataPoolRef.current?.filterKey || current.filterKey,
            dataPool: dataPoolRef.current?.dataPool,
          },
          trigger,
          timestamp: Date.now(),
        });

        // 🚀 USAGE - minimal and clean
        dataPoolRef.current = createDataPoolState(trigger, { filterKey, dataPool });
        // dataPoolRef.current = createDataPoolState(CHANGED.INIT, { filterKey, dataPool });
        // dataPoolRef.current = createDataPoolState(CHANGED.ROUTE, { filterKey, dataPool });
        // dataPoolRef.current = createDataPoolState(CHANGED.FILTERS, { filterKey, dataPool });

        console.log('%c >> dataPoolRef:', 'color:hotpink', dataPoolRef.current);
      }
    },
    [dataPool, filterKey, loaderData],
  );

  // 🚨 COMMENTED OUT: Old useDataPoolProxy hook - replaced with new ref system
  // const { dataPoolProxy } = useDataPoolProxy({ dataPool: dataPoolRef.current?.dataPool || [] });

  // ======================================================================== //
  // ======================================================================== //
  // ======================================================================== //

  // Track route changes to prevent unnecessary re-renders
  const lastRouteDataRef = useRef<{
    filterKey?: string;
    loaderDataLength?: number;
    dataPoolLength?: number;
    sessionId?: string;
    language?: string;
  }>({});

  // Handle route changes (consolidated from LayoutUiObserver)
  useEffect(
    function handleRouteChanges() {
      // 🚨 NEW REF SYSTEM: Calculate correct dataPool for UI inside useEffect
      const getCorrectDataPoolForUI = (): OrderReadableModel[] => {
        if (!dataPoolRef.current) return dataPool;

        const currentDataPool = dataPoolRef.current.dataPool || [];
        const previousDataPool = dataPoolRef.current.previous?.dataPool || [];
        const currentFilterKey = dataPoolRef.current.filterKey;
        const previousFilterKey = dataPoolRef.current.previous?.filterKey;
        const trigger = dataPoolRef.current.trigger;

        // 🚨 FIX: For forward navigation (route-change), use current dataPool
        // This ensures filtered results are shown (e.g., only "vidrio" for containerType)
        if (trigger === 'route-change') {
          console.log('%c🚨 FORWARD NAVIGATION: Using current dataPool', 'color:lime', {
            currentLength: currentDataPool.length,
            previousLength: previousDataPool.length,
            filterKey: currentFilterKey,
            previousFilterKey,
            trigger,
          });
          return currentDataPool;
        }

        // 🚨 For filter-update or initial-load, use current dataPool
        if (trigger === 'filter-update' || trigger === 'initial-load') {
          console.log('%c🚨 FILTER UPDATE/INITIAL: Using current dataPool', 'color:lime', {
            currentLength: currentDataPool.length,
            previousLength: previousDataPool.length,
            filterKey: currentFilterKey,
            trigger,
          });
          return currentDataPool;
        }

        // 🚨 FALLBACK: Use current dataPool
        console.log('%c🚨 FALLBACK: Using current dataPool', 'color:orange', {
          currentLength: currentDataPool.length,
          previousLength: previousDataPool.length,
          filterKey: currentFilterKey,
          trigger,
        });
        return currentDataPool;
      };

      // 🚨 CRITICAL: Only proceed if loaderData is available (non-empty dataset)
      if (!Array.isArray(loaderData)) {
        console.log('%c🚨 SKIPPING ROUTE CHANGE: loaderData not ready', 'color:red');
        return;
      }

      const currentRouteData = {
        filterKey: filterKey || '',
        loaderDataLength: loaderData?.length || 0,
        dataPoolLength: dataPool?.length || 0,
        sessionId: currentSessionId || '',
        language: 'es-ES', // Use default language to avoid i18n dependency
      };

      // Only trigger if route data actually changed
      const hasRouteChanged =
        lastRouteDataRef.current.filterKey !== currentRouteData.filterKey ||
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
          (acc, [filterApiKey, filterValue]) => {
            if (filterApiKey in filters) {
              return { ...acc, [filterApiKey as string]: filterValue.name };
            }
            return acc;
          },
          {} as Record<string, string>,
        );

        // Handle route change
        if (!filterKey) {
          handleRouteChange(undefined, [], {} as any, [], {});
          return;
        }

        try {
          // 🚨 NEW: Get correct dataPool for UI using ref system
          const dataPoolProxy = getCorrectDataPoolForUI();

          if (loaderData && padsConfig && dataPoolProxy) {
            console.log('%c🚨 CALLING handleRouteChange WITH:', 'color:purple', {
              filterKey,
              loaderDataLength: loaderData.length,
              dataPoolProxyLength: dataPoolProxy.length,
              sessionServerFieldMapKeys: Object.keys(sessionServerFieldMap),
            });

            handleRouteChange(
              filterKey,
              loaderData as DataEntry[],
              padsConfig,
              dataPoolProxy as DataEntry[] | OrderModel[] | OrderReadableModel[],
              sessionServerFieldMap,
              'es-ES' as RegionLocale,
            );
          } else {
            console.log('%c🚨 CALLING handleRouteChange WITH EMPTY DATA:', 'color:orange', {
              filterKey,
              hasLoaderData: !!loaderData,
              hasPadsConfig: !!padsConfig,
              hasDataPoolProxy: !!dataPoolProxy,
            });
            handleRouteChange(filterKey, [], {} as any, [], {});
          }
        } catch (error) {
          console.error('useRouteChangeHandler: Error handling route change:', error);
        }
      }
    },
    [filterKey, loaderData, padsConfig, dataPool, currentSessionId, sessions, filters],
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
