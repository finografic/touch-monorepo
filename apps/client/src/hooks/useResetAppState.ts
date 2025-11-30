import { useCallback } from 'react';

import { useFiltersContext } from 'providers/FiltersProvider';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useSession } from 'providers/SessionProvider/SessionContext';

/**
 * Returns a memoized function that resets front-end app state to a clean slate.
 * Intended for transitions back to the main FE flow (e.g., after logout).
 */
export const useResetAppState = () => {
  const { setSelectedSlots, setUiMainPageIsSelectMode } = useLayoutUi();
  const { clearFilters } = useFiltersContext();
  const { clearAllSessions } = useSession();
  const { setOrders, setOrdersReadable, setFilters: setOrdersFilters } = useOrders();
  const { setPageCurrent, setPageIsNextDisabled, setPageIsPrevDisabled } = usePagination();

  const resetAppState = useCallback(() => {
    try {
      // Selections and UI
      setSelectedSlots([]);
      setUiMainPageIsSelectMode(false);

      // Filters and sessions
      clearFilters();
      clearAllSessions();

      // Orders data (selection + any legacy filters)
      setOrders([]);
      setOrdersReadable([]);
      setOrdersFilters({} as any);

      // Pagination back to start
      setPageCurrent(0);
      setPageIsPrevDisabled(true);
      setPageIsNextDisabled(true);
    } catch {
      // Defensive: ignore unexpected errors during reset
    }
  }, [
    clearAllSessions,
    clearFilters,
    setSelectedSlots,
    setOrders,
    setOrdersFilters,
    setOrdersReadable,
    setPageCurrent,
    setPageIsNextDisabled,
    setPageIsPrevDisabled,
    setUiMainPageIsSelectMode,
  ]);

  return { resetAppState };
};
