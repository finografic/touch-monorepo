import { useEffect, useMemo, useRef } from 'react';
import type { RegionLocale } from '@workspace/i18n';
import { useDataPoolProxy } from 'hooks/useDataPoolProxy';
import { useFilters } from 'providers/FiltersProvider/useFilters';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useOrders } from 'providers/OrdersProvider';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useAppConfig } from 'providers/AppConfigProvider';
import type { DataEntry } from 'types/data.types';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { OrderModel } from 'types/models/order.model';
import type { FilterKey } from 'types/slots.types';

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
  const { dataPool, filters } = useFilters();
  const { setFilters: setOrdersFilters } = useOrders();
  const { filterKey, loaderData, padsConfig } = useRouteConfig();
  const { currentLanguage } = useAppConfig();

  // ======================================================================== //
  // 🚨 ENHANCED DATA POOL TRACKING: Route-aware with change context

  const dataPoolRef = useRef<DataPoolTrackingState>();

  useEffect(
    function handleDataPoolChange() {
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
        console.log('%cDATA_POOL_REF:', 'color:cyan', dataPoolRef.current);
      }
    },
    [dataPool, filterKey, loaderData],
  );

  // ======================================================================== //

  // TODO: STILL NEEDED ??  IMPORTANT -- CONFIRM BEFORE REMOVING !!
  // 🚨 COMMENTED OUT: Old useDataPoolProxy hook - replaced with new ref system
  const __TEST = useDataPoolProxy({ dataPool });
  // console.log('%cDATA POOL PROXY:', 'color:grey', __TEST);

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
      // Calculate correct dataPool for UI based on navigation direction
      const getCorrectDataPoolForUI = (): OrderReadableModel[] => {
        if (!dataPoolRef.current) return dataPool;

        const currentDataPool = dataPoolRef.current.dataPool || [];

        // For all navigation types, use current dataPool
        // This ensures filtered results are shown correctly
        return currentDataPool;
      };

      // Only proceed if loaderData is available
      if (!Array.isArray(loaderData)) {
        return;
      }

      const currentRouteData = {
        filterKey: filterKey || '',
        loaderDataLength: loaderData?.length || 0,
        dataPoolLength: dataPool?.length || 0,
        sessionId: currentSessionId || '',
        language: currentLanguage || 'es-ES', // Use actual current language
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

        if (!filterKey) {
          handleRouteChange({
            filterKey: undefined,
            loaderData: [],
            padsConfig: {} as any,
            dataPool: [],
            serverFieldMap: {},
          });
          return;
        }

        try {
          const dataPoolProxy = getCorrectDataPoolForUI();

          if (loaderData && padsConfig && dataPoolProxy) {
            handleRouteChange({
              filterKey,
              loaderData: loaderData as DataEntry[],
              padsConfig,
              dataPool: dataPoolProxy as DataEntry[] | OrderModel[] | OrderReadableModel[],
              serverFieldMap: sessionServerFieldMap,
              currentLanguage: (currentLanguage || 'es-ES') as RegionLocale,
            });
          } else {
            handleRouteChange({
              filterKey,
              loaderData: [],
              padsConfig: {} as any,
              dataPool: [],
              serverFieldMap: {},
            });
          }
        } catch (error) {
          console.error('useRouteChangeHandler: Error handling route change:', error);
        }
      }
    },
    [filterKey, loaderData, padsConfig, dataPool, currentSessionId, sessions, filters, currentLanguage],
  );

  useEffect(
    function syncFiltersToOrdersContext() {
      if (filters && Object.keys(filters).length > 0) {
        setOrdersFilters(filters);
      }
    },
    [filters, setOrdersFilters],
  );
};
