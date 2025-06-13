import { useCallback, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrders } from 'providers/OrdersProvider';
import { useRoutePathnamesByFilters } from 'routes/hooks/useRoutePathnamesByFilters';
import { useTemperatureControl } from 'hooks/useTemperatureControl';
import { useConfigStorage } from 'hooks/useConfigStorage';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { PATHS } from 'routes/routes.config';

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

  const getOperationDisabled = useCallback(
    (actionType: OperationActionType): boolean => {
      const numSelected = orders.filter((order) => order.isSelected).length;

      switch (actionType) {
        case 'clear-completed':
          return !hasCompletedTimers || location.pathname !== PATHS.main || isPending;
        case 'select-all':
          return location.pathname !== PATHS.main || isPending;
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
          return isTemperatureLoading;
        default:
          return isPending;
      }
    },
    [isTemperatureLoading, isPending],
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
