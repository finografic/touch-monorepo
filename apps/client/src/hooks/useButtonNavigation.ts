import { useCallback, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useCurrentFlowStep, useRouteNavigation } from 'routes/hooks/useRouteNavigation';
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
  const { setPageCurrent, isNextDisabled } = usePagination();
  const { nextPath, previousPath, isInFlow, isFirstStep, isLastStep } = useRouteNavigation();
  const currentFlowStep = useCurrentFlowStep();
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

      // Handle main flow navigation using explicit paths
      if (previousPath) {
        setPageCurrent(currentFlowStep - 1);
        navigate(previousPath, { replace: true });
      }
    });
  }, [navigate, previousPath, setPageCurrent, currentFlowStep, location.pathname]);

  const handleNavigateNext = useCallback(async () => {
    console.log('🔍 NAVIGATION DEBUG:', {
      currentFlowStep,
      nextPath,
      location: location.pathname,
    });

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
            // Find closest temperatures (you can implement custom logic here)
            closestInitialTemperature: fullOrderData.temperatureProfiles?.[0]?.temperature,
            closestFinalTemperature: fullOrderData.temperatureProfiles?.[0]?.temperature,
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
    if (nextPath) {
      startTransition(() => {
        setPageCurrent(currentFlowStep + 1);
        navigate(nextPath);
      });
    }
  }, [
    currentFlowStep,
    nextPath,
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
    startTransition(() => {
      setPageCurrent(0);
      navigate(PATHS.drinkType);
    });
  }, [navigate, setPageCurrent]);

  const getNavigationDisabled = useCallback(
    (actionType: NavigationActionType): boolean => {
      switch (actionType) {
        case NAVIGATION_ACTIONS.NAVIGATE_BACK:
          if (location.pathname === ALTERNATIVE_PATHS.time) {
            return isPending;
          }

          return location.pathname === PATHS.main || isFirstStep || isPending;
        case NAVIGATION_ACTIONS.NAVIGATE_NEXT: {
          const disabled = isNextDisabled || isPending || !nextPath;
          return disabled;
        }
        default:
          return false;
      }
    },
    [location.pathname, isFirstStep, isNextDisabled, isPending, nextPath],
  );

  return {
    handleNavigateBack,
    handleNavigateNext,
    handleProgramProduct,
    getNavigationDisabled,
    isNavigationPending: isPending,
  };
};
