import { useEffect, useRef } from 'react';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useFiltering } from 'hooks/useFiltering';
import { useOrders } from 'providers/OrdersProvider';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import type { RegionLocale } from '@workspace/i18n';
import type { DataEntry } from 'types/data.types';
import type { OrderModel } from 'types/models/order.model';
import type { OrderReadableModel } from 'types/models/order-readable.model';

/**
 * Hook to handle route changes and sync filters
 * Separated from useRouteConfig to avoid circular dependencies
 */
export const useRouteChangeHandler = () => {
  const { handleRouteChange } = useLayoutUi();
  const { currentSessionId, sessions } = useSession();
  const { dataPool, filters } = useFiltering();
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

      const sessionServerFieldMap = Object.entries(sessionFilters).reduce(
        (acc, [_filterKey, filterValue]) => {
          if (filterValue && typeof filterValue === 'object' && 'name' in filterValue) {
            return { ...acc, [_filterKey as string]: filterValue.name };
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
  }, [fieldKey, loaderData, padsConfig, dataPool, currentSessionId, sessions, handleRouteChange]);

  // Sync filters from useFiltering to OrdersContext (consolidated from LayoutUiObserver)
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      setOrdersFilters(filters);
    }
  }, [filters, setOrdersFilters]);
};
