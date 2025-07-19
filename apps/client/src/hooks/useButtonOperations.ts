import { useCallback, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrders } from 'providers/OrdersProvider';
import { useRoutePathnamesByFilters } from 'routes/hooks/useRoutePathnamesByFilters';
import { useTemperatureControl } from 'hooks/useTemperatureControl';
import { useConfigStorage } from 'hooks/useConfigStorage';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { ALTERNATIVE_PATHS, PATHS } from 'routes/routes.config';
import { TIME_DEFAULT_SECONDS } from 'constants/time.config';
import { CONFIG_EXPIRY_TIME_MS, STORAGE_KEYS } from 'constants/app.config';
import { ItemType } from 'types/orders.types';
import { ORDER_ITEMS_CONFIG } from 'constants/orders.constants';

type OperationActionType =
  | 'clear-completed'
  | 'cancel-completed'
  | 'select-all'
  | 'start-process'
  | 'program-time'
  | 'program-product'
  | 'repeat-selection';

interface UseButtonOperationsReturn {
  handleClearCompleted: () => void;
  handleCancelCompleted: () => void;
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
  const { selectAllOrders, orders, setOrderProcessing, timerAction, toggleOrder } = useOrders();
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
            log('__DEV: calculatedDurations', 'grey', calculatedDurations);
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

  const handleCancelCompleted = useCallback(() => {
    startTransition(() => {
      // Clear only PROCESSING timers that are SELECTED/checked
      orders.forEach((order) => {
        if (order.process.status === 'processing' && order.isSelected) {
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
    startTransition(() => {
      // Get all ItemType.B slots from config
      const itemTypeBSlots = ORDER_ITEMS_CONFIG.filter((config) => config.itemType === ItemType.B);

      // For each ItemType.B slot, check if it should be selected
      itemTypeBSlots.forEach(({ itemType, number }) => {
        const existingOrder = orders.find((order) => order.itemNumber === number);

        // Select if: no existing order (unchecked) OR existing order is unchecked and idle
        const shouldSelect =
          !existingOrder || (!existingOrder.isSelected && existingOrder.process.status === 'idle');

        if (shouldSelect) {
          toggleOrder({ itemType, itemNumber: number });
        }
      });
    });
  }, [orders, toggleOrder]);

  const handleStartProcess = useCallback(() => {
    log('__DEV: INICIAR - 1', 'yellow', {
      location: location.pathname,
      TIME_DEFAULT_SECONDS,
    });

    // If we're on the TimePage, handle simple timer start
    if (location.pathname === PATHS.temperature || location.pathname === ALTERNATIVE_PATHS.time) {
      log('__DEV: INICIAR - 2', 'yellow', {
        location: location.pathname,
        TIME_DEFAULT_SECONDS,
      });

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

        log('__DEV: INICIAR - 3', 'yellow', {
          location: location.pathname,
          TIME_DEFAULT_SECONDS,
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
    // Check if session storage timer is active
    const timestamp = sessionStorage.getItem(STORAGE_KEYS.CONFIG_TIMESTAMP);
    if (!timestamp) {
      console.error('No session timer found');
      return;
    }

    const startTime = Number.parseInt(timestamp, 10);
    const now = Date.now();
    const elapsed = now - startTime;
    const remaining = Math.max(0, CONFIG_EXPIRY_TIME_MS - elapsed);

    if (remaining <= 0) {
      console.error('Session timer expired');
      return;
    }

    // Load saved configuration
    const configString = sessionStorage.getItem(STORAGE_KEYS.LAST_CONFIG);
    if (!configString) {
      console.error('No saved configuration found');
      return;
    }

    let config;
    try {
      config = JSON.parse(configString);
    } catch (e) {
      console.error('Failed to parse saved configuration:', e);
      return;
    }

    console.log('Applying saved configuration to selected orders:', config);
    console.log('Available durations in config:', config.durations);

    startTransition(() => {
      // Apply configuration to all selected orders
      orders.forEach((order) => {
        if (order.isSelected) {
          // Get duration for this specific item type from saved config
          // Try item type first, then fall back to default
          const itemTypeDuration = config.durations?.[order.itemType];
          const defaultDuration = config.durations?.default;
          const duration = itemTypeDuration || defaultDuration || 300;

          console.log(`Order ${order.itemNumber} (type ${order.itemType}):`, {
            itemTypeDuration,
            defaultDuration,
            finalDuration: duration,
            availableKeys: Object.keys(config.durations || {}),
            orderItemType: order.itemType,
            orderItemTypeType: typeof order.itemType,
            configDurations: config.durations,
            lookupResult: config.durations?.[order.itemType],
          });

          setOrderProcessing({
            itemNumber: order.itemNumber,
            duration,
            preserveSelection: false, // Clear selection after starting
          });
        }
      });
    });
  }, [orders, setOrderProcessing]);

  const getOperationDisabled = useCallback(
    (actionType: OperationActionType): boolean => {
      // Count available orders (idle selected) for operations that need idle orders
      const numAvailableSelected = orders.filter(
        (order) =>
          order.isSelected && order.process.status !== 'processing' && order.process.status !== 'completed',
      ).length;

      // Count any selected orders (including running/completed) for UI state
      const numAnySelected = orders.filter((order) => order.isSelected).length;

      // Count selected processing timers for cancel button
      const numSelectedProcessing = orders.filter(
        (order) => order.isSelected && order.process.status === 'processing',
      ).length;

      switch (actionType) {
        case 'clear-completed':
          return !hasCompletedTimers || location.pathname !== PATHS.main || isPending;
        case 'cancel-completed':
          return numSelectedProcessing === 0 || location.pathname !== PATHS.main || isPending;
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
          // Enable only if there are selected IDLE orders (can't program time for running/completed timers)
          return numAvailableSelected === 0 || location.pathname !== PATHS.main || isPending;
        case 'program-product':
          // Enable only if there are selected IDLE orders (can't program product for running/completed timers)
          return numAvailableSelected === 0 || location.pathname !== PATHS.main || isPending;
        case 'repeat-selection': {
          // Check if session storage timer is active
          const timestamp = sessionStorage.getItem(STORAGE_KEYS.CONFIG_TIMESTAMP);
          if (!timestamp) return true;

          const startTime = Number.parseInt(timestamp, 10);
          const now = Date.now();
          const elapsed = now - startTime;
          const remaining = Math.max(0, CONFIG_EXPIRY_TIME_MS - elapsed);

          // Check if we have saved configuration
          const configString = sessionStorage.getItem(STORAGE_KEYS.LAST_CONFIG);

          // Enable only if: session timer active + saved config exists + orders selected + on main page
          return (
            remaining <= 0 ||
            !configString ||
            numAnySelected === 0 ||
            location.pathname !== PATHS.main ||
            isPending
          );
        }
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
    handleCancelCompleted,
    handleSelectAll,
    handleStartProcess,
    handleProgramTime,
    handleRepeatSelection,
    getOperationDisabled,
    getOperationLoading,
    isOperationPending: isPending,
  };
};
