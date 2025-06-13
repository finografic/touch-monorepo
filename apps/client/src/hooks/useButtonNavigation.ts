import { useCallback, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useRoutePathnamesByFilters } from 'routes/hooks/useRoutePathnamesByFilters';
import { PATHS } from 'routes/routes.config';

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
    if (current > 0) {
      startTransition(() => {
        const newIndex = current - 1;
        const nextPathname = pathnames[newIndex];
        setPageCurrent(newIndex);
        navigate(nextPathname, { replace: true });
      });
    }
  }, [current, navigate, pathnames, setPageCurrent]);

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
    (actionType: 'navigate-back' | 'navigate-next'): boolean => {
      switch (actionType) {
        case 'navigate-back':
          return location.pathname === PATHS.main || current <= 0 || isPending;
        case 'navigate-next':
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
