import { useEffect, useMemo, useRef } from 'react';
import { useLayoutUi } from './LayoutUiContext';
import { useRouteLoaderData } from 'react-router-dom';
import type { DataEntry } from 'types/data.types';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useFilters } from 'hooks/useFilters';
import { useSession } from 'providers/SessionProvider/SessionContext';

export const LayoutUiObserver = () => {
  const { fieldKey, filterKey, padsConfig } = useRouteConfig();
  const { setIsNextDisabled } = usePagination();
  const { pads, handleRouteChange: updatePadsForRoute } = useLayoutUi();
  const { currentSessionId, sessions } = useSession();
  const isInitializedRef = useRef<Record<string, boolean>>({});

  const loaderData = useRouteLoaderData(fieldKey || 'root') as DataEntry[];
  const { dataPool } = useFilters();

  // Memoize session-specific serverFieldMap to prevent infinite loops
  const sessionServerFieldMap = useMemo(() => {
    const sessionFilters =
      currentSessionId && sessions[currentSessionId] ? sessions[currentSessionId].filters : {};

    return Object.entries(sessionFilters).reduce(
      (acc, [_filterKey, filterValue]) => {
        if (filterValue && typeof filterValue === 'object' && 'name' in filterValue) {
          return { ...acc, [_filterKey as string]: filterValue.name };
        }
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [currentSessionId, sessions]);

  // Handle route changes with subscription-based approach
  useEffect(
    function handleRouteChange() {
      if (!fieldKey) {
        updatePadsForRoute(undefined, [], {} as any, [], {});
        return;
      }

      if (loaderData && padsConfig && dataPool) {
        isInitializedRef.current[fieldKey] = false;
        updatePadsForRoute(fieldKey, loaderData, padsConfig, dataPool, sessionServerFieldMap);
        isInitializedRef.current[fieldKey] = true;
        return;
      }

      updatePadsForRoute(fieldKey, [], {} as any, [], {});
    },
    [fieldKey, loaderData, dataPool, sessionServerFieldMap, padsConfig, updatePadsForRoute],
  );

  // Handle pagination validation
  useEffect(
    function handlePadChange() {
      if (!pads?.length || !fieldKey) return;
      if (!isInitializedRef.current[fieldKey]) return;

      if (padsConfig?.minRequired !== undefined) {
        const checkedCount = pads.filter((pad) => pad.isChecked).length;
        setIsNextDisabled(checkedCount < padsConfig.minRequired);
      }
    },
    [pads, fieldKey, padsConfig, setIsNextDisabled],
  );

  return null;
};
