import { useCallback, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrders } from 'providers/OrdersProvider';
import { useRoutePathnamesByFilters } from 'routes/hooks/useRoutePathnamesByFilters';
import { useTemperatureControl } from 'hooks/useTemperatureControl';
import { useConfigStorage } from 'hooks/useConfigStorage';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { ALTERNATIVE_PATHS, PATHS } from 'routes/routes.config';
import { TIME_DEFAULT_SECONDS } from 'constants/time.config';

type OperationActionType =
  | 'clear-completed'
  | 'select-all'
  | 'start-process'
  | 'program-time'
  | 'repeat-selection';

interface UseButtonOperationsReturn {
  handleClearCompleted: () => void;
  handleSelectAll: () => void;
  handleStartProcess: () => void;
  handleProgramTime: () => void;
  handleRepeatSelection: () => void;
  getOperationDisabled: (actionType: OperationActionType) => boolean;
  getOperationLoading: (actionType: OperationActionType) => boolean;
  isOperationPending: boolean;
}

export const useButtonOperations = (): UseButtonOperationsReturn => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const { setPageCurrent } = usePagination();
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

  // Check if there are any selected items
  const hasSelectedItems = orders.some((order) => order.isSelected);

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

  const handleStartProcess = useCallback(() => {
    // If we're on the TimePage, handle simple timer start
    if (location.pathname === ALTERNATIVE_PATHS.time) {
      startTransition(() => {
        // Set timers for all selected orders with the configured time
        // TODO: Get the actual time from TimePage state - for now use default
        const duration = TIME_DEFAULT_SECONDS;

        orders.forEach((order) => {
          if (order.isSelected) {
            setOrderProcessing({
              itemNumber: order.itemNumber,
              duration,
            });
          }
        });

        // Navigate back to main page
        navigate(PATHS.main, { replace: true });
      });
    } else {
      // Default temperature control process
      startTemperatureControl();
    }
  }, [location.pathname, startTemperatureControl, orders, setOrderProcessing, navigate]);

  const handleProgramTime = useCallback(() => {
    startTransition(() => {
      navigate(ALTERNATIVE_PATHS.time);
    });
  }, [navigate]);

  const handleRepeatSelection = useCallback(() => {
    // TODO: Implement repeat selection functionality
    console.log('Repeat selection action not yet implemented');
  }, []);

  const getOperationDisabled = useCallback(
    (actionType: OperationActionType): boolean => {
      // Count available orders (idle selected) for operations that need idle orders
      const numAvailableSelected = orders.filter(
        (order) =>
          order.isSelected && order.process.status !== 'processing' && order.process.status !== 'completed',
      ).length;

      // Count any selected orders (including running/completed) for UI state
      const numAnySelected = orders.filter((order) => order.isSelected).length;

      switch (actionType) {
        case 'clear-completed':
          return !hasCompletedTimers || location.pathname !== PATHS.main || isPending;
        case 'select-all':
          return location.pathname !== PATHS.main || isPending;
        case 'start-process':
          // On TimePage: check if we have selected items
          if (location.pathname === ALTERNATIVE_PATHS.time) {
            return !hasSelectedItems || isPending;
          }
          // On temperature page: original logic
          return (
            isTemperatureLoading ||
            isPending ||
            (temperatureProfilesQuery.isError && !temperatureProfilesQuery.data) ||
            location.pathname !== PATHS.temperature
          );
        case 'program-time':
          // Enable if ANY orders are selected (including running timers)
          return numAnySelected === 0 || location.pathname !== PATHS.main || isPending;
        case 'repeat-selection':
          return true; // Disabled until implemented
        default:
          return false;
      }
    },
    [
      hasCompletedTimers,
      hasSelectedItems,
      location.pathname,
      isPending,
      isTemperatureLoading,
      temperatureProfilesQuery.isError,
      temperatureProfilesQuery.data,
      orders,
    ],
  );

  const getOperationLoading = useCallback(
    (actionType: OperationActionType): boolean => {
      switch (actionType) {
        case 'start-process':
          // On TimePage, use basic pending state
          if (location.pathname === ALTERNATIVE_PATHS.time) {
            return isPending;
          }
          // On temperature page, use temperature loading
          return isTemperatureLoading;
        default:
          return isPending;
      }
    },
    [location.pathname, isTemperatureLoading, isPending],
  );

  return {
    handleClearCompleted,
    handleSelectAll,
    handleStartProcess,
    handleProgramTime,
    handleRepeatSelection,
    getOperationDisabled,
    getOperationLoading,
    isOperationPending: isPending,
  };
};
