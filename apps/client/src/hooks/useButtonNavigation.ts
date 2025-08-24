import { useCallback, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useRoutePathnamesByFilters } from 'routes/hooks/useRoutePathnamesByFilters';
import { useFilters } from 'hooks/useFilters';
import { useOrders } from 'providers/OrdersProvider';
import { ALTERNATIVE_PATHS, PATHS } from 'routes/routes.config';

const NAVIGATION_ACTIONS = {
  NAVIGATE_BACK: 'navigate-back',
  NAVIGATE_NEXT: 'navigate-next',
} as const;

type NavigationActionType = (typeof NAVIGATION_ACTIONS)[keyof typeof NAVIGATION_ACTIONS];

interface UseButtonNavigationReturn {
  handleNavigateBack: () => void;
  handleNavigateNext: () => void;
  handleProgramProduct: () => void;
  getNavigationDisabled: (actionType: 'navigate-back' | 'navigate-next') => boolean;
  isNavigationPending: boolean;
}

export const useButtonNavigation = (): UseButtonNavigationReturn => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const { current, setPageCurrent, isNextDisabled } = usePagination();
  const { pathnames } = useRoutePathnamesByFilters();
  const { dataFiltered } = useFilters();
  const { setProfile, fetchOrderWithProfiles, ordersReadable } = useOrders();

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
      // Debug the navigation logic
      console.log('🔍 handleNavigateNext Debug:', {
        locationPathname: location.pathname,
        expectedPath: '/container-type',
        isContainerTypePage: location.pathname === '/container-type',
        dataFilteredLength: dataFiltered.length,
        currentOrderId: dataFiltered[0]?.id,
      });

      // Set profile when navigating from ContainerType page to Temperature page
      if (location.pathname === '/container-type' && dataFiltered.length > 0) {
        console.log('🔍 ContainerType condition met - fetching order with profiles');

        // Get the order ID from the filtered data and find the readable model from context
        const orderId = dataFiltered[0].id;
        const profileOrder = ordersReadable.find((order) => order.id === orderId);

        if (profileOrder) {
          console.log('🔍 Setting profile and fetching complete order:', orderId);
          setProfile(profileOrder); // Set basic profile first

          // ADD THIS LINE to fetch complete order with temperature profiles:
          fetchOrderWithProfiles(orderId);
        } else {
          console.log('🔍 Profile order not found in ordersReadable');
        }
      } else {
        console.log('🔍 ContainerType condition NOT met:', {
          pathnameMatch: location.pathname === '/container-type',
          hasDataFiltered: dataFiltered.length > 0,
        });
      }

      setPageCurrent(newIndex);
      if (nextPathname) {
        navigate(nextPathname, { replace: true });
      }
    });
  }, [
    current,
    navigate,
    pathnames,
    setPageCurrent,
    location.pathname,
    dataFiltered,
    setProfile,
    fetchOrderWithProfiles, // ADD THIS DEPENDENCY
    ordersReadable,
  ]);

  const handleProgramProduct = useCallback(() => {
    const newIndex = current + 1;
    const nextPathname = pathnames[newIndex];

    startTransition(() => {
      setPageCurrent(newIndex);
      if (nextPathname) {
        navigate(nextPathname); // No replace: true
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
    handleProgramProduct,
    getNavigationDisabled,
    isNavigationPending: isPending,
  };
};
