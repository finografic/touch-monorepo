import { useCallback, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useRoutePathnamesByFilters } from 'routes/hooks/useRoutePathnamesByFilters';
import { useFiltering } from 'hooks/useFiltering';
import { useFilters } from 'providers/FiltersProvider';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useOrders } from 'providers/OrdersProvider';
import { ALTERNATIVE_PATHS, PATHS } from 'routes/routes.config';
import type { TemperatureFilter } from 'types/temperature.types';

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
  const { dataFiltered } = useFiltering();
  const { setFilter } = useFilters();
  const { currentSessionId, sessions, updateSessionFilters } = useSession();
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

  const handleNavigateNext = useCallback(async () => {
    const newIndex = current + 1;
    const nextPathname = pathnames[newIndex];

    // Handle async temperature filter logic outside of startTransition
    if (location.pathname === '/container-type' && dataFiltered.length > 0) {
      // Get the order ID from the filtered data and find the readable model from context
      const orderId = dataFiltered[0].id;
      const profileOrder = ordersReadable.find((order) => order.id === orderId);
      if (profileOrder) {
        setProfile(profileOrder); // Set basic profile first

        try {
          // Fetch complete order with temperature profiles
          const fullOrderData = await fetchOrderWithProfiles(orderId);

          // Create temperature filter from the fetched data
          const temperatureFilter: TemperatureFilter = {
            defaultConsume: fullOrderData.defaultTempConsume,
            defaultFreeze: fullOrderData.defaultTempFreeze,
            temperatureProfiles: fullOrderData.temperatureProfiles || [],
            // Set initial and final to defaults if available
            initial: fullOrderData.defaultTempConsume,
            final: fullOrderData.defaultTempFreeze,
            // Find closest temperature (you can implement custom logic here)
            closestInitialTemperature: fullOrderData.temperatureProfiles?.[0]?.temperature,
          };

          // Set temperature filter using the new FiltersContext
          setFilter('temperature', temperatureFilter);

          // Also update session filters for backward compatibility
          if (currentSessionId) {
            const currentSessionFilters = sessions[currentSessionId]?.filters || {};
            const newSessionFilters = {
              ...currentSessionFilters,
              temperature: temperatureFilter,
            };
            updateSessionFilters(currentSessionId, newSessionFilters);
          }

          console.log('Temperature filter set:', temperatureFilter);
        } catch (error) {
          console.error('Failed to fetch order with profiles:', error);
        }
      }
    }

    // Use startTransition for the navigation part only
    startTransition(() => {
      setPageCurrent(newIndex);
      navigate(nextPathname);
    });
  }, [
    current,
    pathnames,
    startTransition,
    location.pathname,
    dataFiltered,
    ordersReadable,
    setProfile,
    fetchOrderWithProfiles,
    setFilter,
    currentSessionId,
    sessions,
    updateSessionFilters,
    setPageCurrent,
    navigate,
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
