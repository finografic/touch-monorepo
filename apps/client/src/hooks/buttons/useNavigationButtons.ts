import { useCallback, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFiltersContext } from 'providers/FiltersProvider';
import { useFilters } from 'providers/FiltersProvider/useFilters';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useCurrentFlowStep, useRouteNavigation } from 'routes/hooks/useRouteNavigation';
import { BUTTON_TYPE } from 'types/button.types';
import type { TemperatureFilter } from 'types/temperature.types';
import { ALTERNATIVE_PATHS, PATHS } from 'config/routes';

type NavigationActionType = typeof BUTTON_TYPE.NAVIGATE_BACK | typeof BUTTON_TYPE.NAVIGATE_NEXT;

interface UseButtonNavigationReturn {
  handleNavigateBack: () => void;
  handleNavigateNext: () => void;
  getNavigationDisabled: (actionType: NavigationActionType) => boolean;
  isNavigationPending: boolean;
}

export const useNavigationButtons = (): UseButtonNavigationReturn => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const { setPageCurrent, isNextDisabled } = usePagination();
  const { nextPath, previousPath, isInFlow, isFirstStep, isLastStep } = useRouteNavigation();
  const currentFlowStep = useCurrentFlowStep();
  const { dataFiltered } = useFilters();
  const { setFilter } = useFiltersContext();
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
    // ⚠️ Only run product flow logic on /container-type route
    if (location.pathname === '/container-type' && dataFiltered.length > 0) {
      const orderId = dataFiltered[0].id;
      const profileOrder = ordersReadable?.find((order) => order.id === orderId);
      if (profileOrder) {
        setProfile(profileOrder);

        try {
          const fullOrderData = await fetchOrderWithProfiles(orderId);

          const temperatureFilter: TemperatureFilter = {
            defaultConsume: fullOrderData.defaultTempConsume,
            defaultFreeze: fullOrderData.defaultTempFreeze,
            temperatureProfiles: fullOrderData.temperatureProfiles || [],
            initial: fullOrderData.defaultTempConsume,
            final: fullOrderData.defaultTempFreeze,
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

  const getNavigationDisabled = useCallback(
    (actionType: NavigationActionType): boolean => {
      switch (actionType) {
        case BUTTON_TYPE.NAVIGATE_BACK:
          if (location.pathname === ALTERNATIVE_PATHS.time) {
            return isPending;
          }

          return location.pathname === PATHS.main || isFirstStep || isPending;
        case BUTTON_TYPE.NAVIGATE_NEXT: {
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
    getNavigationDisabled,
    isNavigationPending: isPending,
  };
};
