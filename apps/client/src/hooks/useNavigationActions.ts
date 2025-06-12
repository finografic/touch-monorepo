import { useCallback, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useRoutePathnamesByFilters } from 'routes/hooks/useRoutePathnamesByFilters';
import { useTemperatureControl } from 'hooks/useTemperatureControl';
import { useConfigStorage } from 'hooks/useConfigStorage';
import { PATHS } from 'routes/routes.config';
import type { NavigationActionType } from 'types/navigation.types';

interface UseNavigationActionsReturn {
  executeAction: (actionType: NavigationActionType) => void;
  getActionDisabled: (actionType: NavigationActionType) => boolean;
  getActionLoading: (actionType: NavigationActionType) => boolean;
  isPending: boolean;
}

export const useNavigationActions = (): UseNavigationActionsReturn => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const { current, setPageCurrent, isNextDisabled } = usePagination();
  const { selectAllOrders, orders, setOrderProcessing, timerAction } = useOrders();
  const { pathnames } = useRoutePathnamesByFilters();
  const { saveConfig } = useConfigStorage();

  const {
    startTemperatureControl,
    temperatureProfilesQuery,
    isLoading: isTemperatureLoading,
  } = useTemperatureControl({
    onSuccess: (calculatedDurations) => {
      startTransition(function updateProcessForSelectedOrders() {
        orders.forEach((order) => {
          if (order.isSelected) {
            setOrderProcessing({
              itemNumber: order.itemNumber,
              duration: calculatedDurations[order.itemNumber.toString()],
            });
          }
        });

        // Navigate back to first page
        setPageCurrent(0);
        navigate(pathnames[0], { replace: true });
      });
    },

    onError: (error) => {
      // TODO: Show error message to user
      console.error('Failed to control temperature:', error);
    },
  });

  // Check if there are any completed timers
  const hasCompletedTimers = orders.some((order) => order.process.status === 'completed');

  const handleClearCompleted = useCallback(() => {
    startTransition(() => {
      // Clear all completed timers by resetting their process status to 'idle'
      orders.forEach((order) => {
        if (order.process.status === 'completed') {
          timerAction('reset', { itemNumber: order.itemNumber });
        }
      });

      // Save new configuration to reset timer
      const selectedOrders = orders.filter((order) => order.isSelected);
      saveConfig({
        filters: {},
        temperatures: { default: 25 },
        durations: { default: 300 },
        selectedOrders: selectedOrders.map((order) => order.itemNumber),
      });
    });
  }, [orders, timerAction, saveConfig]);

  const handleSelectAll = useCallback(() => {
    selectAllOrders();
  }, [selectAllOrders]);

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

  const handleStartProcess = useCallback(() => {
    startTemperatureControl();
  }, [startTemperatureControl]);

  const handleProgramTime = useCallback(() => {
    // TODO: Implement program time functionality
    console.log('Program time action not yet implemented');
  }, []);

  const handleRepeatSelection = useCallback(() => {
    // TODO: Implement repeat selection functionality
    console.log('Repeat selection action not yet implemented');
  }, []);

  const executeAction = useCallback(
    (actionType: NavigationActionType) => {
      switch (actionType) {
        case 'clear-completed':
          return handleClearCompleted();
        case 'select-all':
          return handleSelectAll();
        case 'navigate-back':
          return handleNavigateBack();
        case 'navigate-next':
          return handleNavigateNext();
        case 'start-process':
          return handleStartProcess();
        case 'program-time':
          return handleProgramTime();
        case 'repeat-selection':
          return handleRepeatSelection();
        default:
          console.warn(`Unknown navigation action: ${actionType}`);
      }
    },
    [
      handleClearCompleted,
      handleSelectAll,
      handleNavigateBack,
      handleNavigateNext,
      handleStartProcess,
      handleProgramTime,
      handleRepeatSelection,
    ],
  );

  const getActionDisabled = useCallback(
    (actionType: NavigationActionType): boolean => {
      const numSelected = orders.filter((order) => order.isSelected).length;

      switch (actionType) {
        case 'clear-completed':
          return !hasCompletedTimers || location.pathname !== PATHS.main || isPending;
        case 'select-all':
          return location.pathname !== PATHS.main || isPending;
        case 'navigate-back':
          return location.pathname === PATHS.main || current <= 0 || isPending;
        case 'navigate-next':
          return isNextDisabled || isPending;
        case 'start-process':
          return (
            isTemperatureLoading ||
            isPending ||
            (temperatureProfilesQuery.isError && !temperatureProfilesQuery.data) ||
            location.pathname !== PATHS.temperature
          );
        case 'program-time':
          return true; // Disabled until implemented
        case 'repeat-selection':
          return true; // Disabled until implemented
        default:
          return false;
      }
    },
    [
      hasCompletedTimers,
      location.pathname,
      isPending,
      current,
      isNextDisabled,
      isTemperatureLoading,
      temperatureProfilesQuery.isError,
      temperatureProfilesQuery.data,
      orders,
    ],
  );

  const getActionLoading = useCallback(
    (actionType: NavigationActionType): boolean => {
      switch (actionType) {
        case 'start-process':
          return isTemperatureLoading;
        default:
          return isPending;
      }
    },
    [isTemperatureLoading, isPending],
  );

  return {
    executeAction,
    getActionDisabled,
    getActionLoading,
    isPending,
  };
};
