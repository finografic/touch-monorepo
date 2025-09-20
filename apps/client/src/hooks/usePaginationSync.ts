import { useEffect } from 'react';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useCurrentFlowStep } from 'routes/hooks/useRouteNavigation';
import { useLocation } from 'react-router-dom';
import { PATHS } from 'routes/routes.config';

/**
 * Hook to synchronize pagination state with the current route
 * Ensures that the pagination current value matches the actual flow step
 */
export const usePaginationSync = () => {
  const { setPageCurrent } = usePagination();
  const currentFlowStep = useCurrentFlowStep();
  const location = useLocation();

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
