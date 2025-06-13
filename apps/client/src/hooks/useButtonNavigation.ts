import { useCallback, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useRoutePathnamesByFilters } from 'routes/hooks/useRoutePathnamesByFilters';
import { ALTERNATIVE_PATHS, PATHS } from 'routes/routes.config';

const NAVIGATION_ACTIONS = {
  NAVIGATE_BACK: 'navigate-back',
  NAVIGATE_NEXT: 'navigate-next',
} as const;

type NavigationActionType = (typeof NAVIGATION_ACTIONS)[keyof typeof NAVIGATION_ACTIONS];

interface UseButtonNavigationReturn {
  handleNavigateBack: () => void;
  handleNavigateNext: () => void;
  getNavigationDisabled: (actionType: 'navigate-back' | 'navigate-next') => boolean;
  isNavigationPending: boolean;
}

export const useButtonNavigation = (): UseButtonNavigationReturn => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const { current, setPageCurrent, isNextDisabled } = usePagination();
  const { pathnames } = useRoutePathnamesByFilters();

  const handleNavigateBack = useCallback(() => {
    startTransition(() => {
      // Handle alternative routes (like TimePage) - navigate back to main
      if (location.pathname === ALTERNATIVE_PATHS.time) {
        navigate(PATHS.main, { replace: true });
        return;
      }

      // Handle main flow navigation using pagination
      if (current > 0) {
        const newIndex = current - 1;
        const nextPathname = pathnames[newIndex];
        setPageCurrent(newIndex);
        navigate(nextPathname, { replace: true });
      }
    });
  }, [current, navigate, pathnames, setPageCurrent, location.pathname]);

  const handleNavigateNext = useCallback(() => {
    const newIndex = current + 1;
    const nextPathname = pathnames[newIndex];

    startTransition(() => {
      setPageCurrent(newIndex);
      if (nextPathname) {
        navigate(nextPathname, { replace: true });
      }
    });
  }, [current, navigate, pathnames, setPageCurrent]);

  const getNavigationDisabled = useCallback(
    (actionType: NavigationActionType): boolean => {
      switch (actionType) {
        case NAVIGATION_ACTIONS.NAVIGATE_BACK:
          // For alternative routes, back is always enabled (unless pending)
          if (location.pathname === ALTERNATIVE_PATHS.time) {
            return isPending;
          }
          // For main flow, disable if at main page or first step
          return location.pathname === PATHS.main || current <= 0 || isPending;
        case NAVIGATION_ACTIONS.NAVIGATE_NEXT:
          return isNextDisabled || isPending;
        default:
          return false;
      }
    },
    [location.pathname, current, isNextDisabled, isPending],
  );

  return {
    handleNavigateBack,
    handleNavigateNext,
    getNavigationDisabled,
    isNavigationPending: isPending,
  };
};
