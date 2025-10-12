import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useCurrentFlowStep } from 'routes/hooks/useRouteNavigation';
import { PATHS } from 'config';

/**
 * Consolidated pagination hook that handles both management and synchronization
 * Combines logic from usePaginationManagement and usePaginationSync
 */
export const usePaginationLogic = () => {
  const { pads } = useLayoutUi();
  const { filterFieldKey, padsConfig } = useRouteConfig();
  const { setIsNextDisabled, setPageCurrent } = usePagination();
  const currentFlowStep = useCurrentFlowStep();
  const location = useLocation();

  // Handle pad changes for pagination (from usePaginationManagement)
  useEffect(() => {
    if (!pads?.length || !filterFieldKey) return;

    if (padsConfig?.minRequired !== undefined) {
      const checkedCount = pads.filter((pad) => pad.isChecked).length;
      const shouldDisableNext = checkedCount < padsConfig.minRequired;

      setIsNextDisabled(shouldDisableNext);
    }
  }, [pads, filterFieldKey, padsConfig?.minRequired, setIsNextDisabled]);

  // Synchronize pagination state with current route (from usePaginationSync)
  useEffect(() => {
    // Only sync for flow pages (not main page or alternative routes)
    if (currentFlowStep >= 0) {
      setPageCurrent(currentFlowStep);
    } else if (location.pathname === PATHS.main) {
      // Reset to 0 when on main page
      setPageCurrent(0);
    }
  }, [currentFlowStep, location.pathname, setPageCurrent]);
};
