import { useEffect, useMemo, useRef } from 'react';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useFilters } from 'providers/FiltersProvider/useFilters';
import { useOrders } from 'providers/OrdersProvider';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useDataPoolProxy } from './useDataPoolProxy';
import type { RegionLocale } from '@workspace/i18n';
import type { DataEntry } from 'types/data.types';
import type { OrderModel } from 'types/models/order.model';
import type { OrderReadableModel } from 'types/models/order-readable.model';

// Union type for dataPool change reasons
type DataPoolChangeReason = 'route-change' | 'filter-update' | 'initial-load';

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
  const dataPoolHistoryRef = useRef<{
    previous: OrderReadableModel[];
    current: OrderReadableModel[];
    filterKey: string;
    changeReason: DataPoolChangeReason;
    timestamp: number;
  }>({
    previous: [],
    current: [],
    filterKey: '',
    changeReason: 'initial-load',
    timestamp: Date.now(),
  });

  // 🚨 ROUTE-AWARE DATA POOL TRACKING
  useEffect(
    function handle_DATA_POOL_CHANGE() {
      const currentFilterKey = filterKey || '';
      const previousFilterKey = dataPoolHistoryRef.current.filterKey;

      // Determine change reason using flat conditional logic
      let changeReason: DataPoolChangeReason;

      switch (true) {
        case previousFilterKey === '':
          changeReason = 'initial-load';
          break;
        case currentFilterKey !== previousFilterKey:
          changeReason = 'filter-update';
          break;
        default:
          changeReason = 'route-change';
      }

      const reason: Record<string, DataPoolChangeReason> = {
        '': 'initial-load',
        'filter-update': 'filter-update',
        'route-change': 'route-change',
      };

      changeReason = reason[previousFilterKey];

      const reasonV2 = [
        ['initial-load', previousFilterKey === ''],
        ['route-change', currentFilterKey !== previousFilterKey],
        ['filter-update', true],
      ].find(([reason]) => reason[1])?.[0];

      // changeReason = reasonV2.find(([reason]) => reason === previousFilterKey)?.[1]();
      //   'route-change': () => currentFilterKey !== previousFilterKey,
      //   'filter-update': () => true,
      // };

      // TODO: KEEP THIS CODE FOR REFERENCE !!
      // if (previousFilterKey === '') {
      //   changeReason = 'initial-load';
      // } else if (currentFilterKey !== previousFilterKey) {
      //   changeReason = 'route-change';
      // } else {
      //   changeReason = 'filter-update';
      // }

      // Update history using object-based dispatch
      const updateHistory: Record<DataPoolChangeReason, () => void> = {
        'route-change': () => {
          // Route change: preserve previous dataPool, update current
          dataPoolHistoryRef.current.previous = dataPoolHistoryRef.current.current;
          dataPoolHistoryRef.current.current = dataPool;
          dataPoolHistoryRef.current.filterKey = currentFilterKey;
          dataPoolHistoryRef.current.changeReason = changeReason;
          dataPoolHistoryRef.current.timestamp = Date.now();

          console.log('%c🚨 ROUTE CHANGE DETECTED:', 'color:orange', {
            from: previousFilterKey,
            to: currentFilterKey,
            previousDataPool: dataPoolHistoryRef.current.previous.length,
            currentDataPool: dataPoolHistoryRef.current.current.length,
            timestamp: new Date(dataPoolHistoryRef.current.timestamp).toISOString(),
          });
        },
        'filter-update': () => {
          // Filter update: just update current
          dataPoolHistoryRef.current.current = dataPool;
          dataPoolHistoryRef.current.filterKey = currentFilterKey;
          dataPoolHistoryRef.current.changeReason = changeReason;
          dataPoolHistoryRef.current.timestamp = Date.now();

          console.log('%c🔄 FILTER UPDATE:', 'color:blue', {
            filterKey: currentFilterKey,
            previousDataPool: dataPoolHistoryRef.current.previous.length,
            currentDataPool: dataPoolHistoryRef.current.current.length,
            timestamp: new Date(dataPoolHistoryRef.current.timestamp).toISOString(),
          });
        },
        'initial-load': () => {
          // Initial load: just update current
          dataPoolHistoryRef.current.current = dataPool;
          dataPoolHistoryRef.current.filterKey = currentFilterKey;
          dataPoolHistoryRef.current.changeReason = changeReason;
          dataPoolHistoryRef.current.timestamp = Date.now();
        },
      };

      // Execute the appropriate update function with single lookup
      updateHistory[changeReason]?.();
    },
    [dataPool, filterKey],
  );

  useEffect(
    function handle_TEST_DATA() {
      if (Array.isArray(loaderData)) {
        console.log('%c >> filtered:', 'color:lime', loaderData);
        console.log('%c >> filtered:', 'color:lime', { data });
        console.log('%c >> filtered:', 'color:lime', { dataPool });
        console.log('%c >> filtered:', 'color:lime', { dataFiltered });
        console.log('%c >> dataPoolHistory:', 'color:cyan', {
          changeReason: dataPoolHistoryRef.current.changeReason,
          previousLength: dataPoolHistoryRef.current.previous.length,
          currentLength: dataPoolHistoryRef.current.current.length,
          filterKey: dataPoolHistoryRef.current.filterKey,
        });
      }
    },
    [loaderData],
  );

  // 🚨 DATA POOL PROXY: Create proxy dataPool that injects mock entries when needed
  const { dataPoolProxy } = useDataPoolProxy({ dataPool });

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

        console.log('%c >> sessionServerFieldMap:', 'color:hotpink', sessionServerFieldMap, filterKey);

        // Handle route change
        if (!filterKey) {
          handleRouteChange(undefined, [], {} as any, [], {});
          return;
        }

        try {
          if (loaderData && padsConfig && dataPoolProxy) {
            handleRouteChange(
              filterKey,
              loaderData as DataEntry[],
              padsConfig,
              dataPoolProxy as DataEntry[] | OrderModel[] | OrderReadableModel[],
              sessionServerFieldMap,
              'es-ES' as RegionLocale,
            );
          } else {
            handleRouteChange(filterKey, [], {} as any, [], {});
          }
        } catch (error) {
          console.error('useRouteChangeHandler: Error handling route change:', error);
        }
      }
    },
    [filterKey, loaderData, padsConfig, dataPoolProxy, currentSessionId, sessions],
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
