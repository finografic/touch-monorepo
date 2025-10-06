import { useCallback } from 'react';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';
import { useFiltersContext } from 'providers/FiltersProvider';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';

/**
 * Returns a memoized function that resets front-end app state to a clean slate.
 * Intended for transitions back to the main FE flow (e.g., after logout).
 */
export const useResetAppState = () => {
  const { clearMainPageSelection, setUiMainPageIsSelectMode } = useLayoutUi();
  const { clearFilters } = useFiltersContext();
  const { clearAllSessions } = useSession();
  const { setOrders, setOrdersReadable, setFilters: setOrdersFilters } = useOrders();
  const { setPageCurrent, setPageIsNextDisabled, setPageIsPrevDisabled } = usePagination();

  const resetAppState = useCallback(() => {
    try {
      // Selections and UI
      clearMainPageSelection();
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
    clearMainPageSelection,
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
