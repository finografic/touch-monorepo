import { useCallback, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrders } from 'providers/OrdersProvider';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useTimers } from 'providers/TimersProvider';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useRoutePathnamesByFilters } from 'routes/hooks/useRoutePathnamesByFilters';
import { useTemperatureControl } from 'hooks/useTemperatureControl';
import { useConfigStorage } from 'hooks/useConfigStorage';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useOrderItemsConfig } from 'hooks/useOrderItemsConfig';
import { ALTERNATIVE_PATHS, PATHS } from 'routes/routes.config';
import { TIME_DEFAULT_SECONDS } from 'constants/time.config';
import { CONFIG_EXPIRY_TIME_MS, STORAGE_KEYS } from 'constants/app.config';
import { ItemType } from 'types/orders.types';
import { FLOW_TYPES } from 'types/flow.types';
import createCuid from '@bugsnag/cuid';

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
  handleStartProductProcess: () => void;
  handleStartTimeProcess: (duration: number) => void;
  handleProgramTime: () => void;
  handleProgramProduct: () => void;
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
  const { selectAllOrders, orders, setOrderProcessing, toggleOrder, setOrdersSession } = useOrders();
  const { createSession, assignOrdersToSession, currentSessionId } = useSession();
  const { addTimer, clearCompletedTimers, timers, removeTimer } = useTimers();
  const { selectAllMainPageSlots, clearMainPageSelection, toggleMainPageSlot, mainPageSelectedSlots } =
    useLayoutUi();
  const { pathnames } = useRoutePathnamesByFilters();
  const { saveConfig } = useConfigStorage();
  const orderItemsConfig = useOrderItemsConfig();

  const {
    startTemperatureControl,
    temperatureProfilesQuery,
    isLoading: isTemperatureLoading,
  } = useTemperatureControl({
    onSuccess: (calculatedDurations) => {
      startTransition(function updateProcessForSelectedOrders() {
        console.log('🚀 Temperature Control Success: Creating timers for selected orders');
        console.log('🚀 Temperature Control: Selected slots =', mainPageSelectedSlots);
        console.log('🚀 Temperature Control: Calculated durations =', calculatedDurations);

        // First, set orders to processing state and create timers
        mainPageSelectedSlots.forEach((slotNumber) => {
          const order = orders.find((o) => o.itemNumber === slotNumber);
          if (order) {
            const duration = calculatedDurations[order.itemNumber.toString()];
            log('__DEV: calculatedDurations', 'grey', calculatedDurations);

            // Set order to processing
            setOrderProcessing({
              itemNumber: order.itemNumber,
              duration,
            });

            // Create timer for this slot
            console.log(
              '🚀 Temperature Control: Adding timer for slot',
              slotNumber,
              'with duration',
              duration,
            );

            // Check if there's already a timer for this slot
            const existingTimer = timers.find((t) => t.slotNumber === slotNumber);
            const orderId = existingTimer?.orderId || createCuid();

            console.log('🚀 Temperature Control: Timer details', {
              slotNumber,
              existingTimerId: existingTimer?.id,
              newOrderId: orderId,
              reusingOrderId: !!existingTimer?.orderId,
            });

            addTimer({
              sessionId: currentSessionId!,
              slotNumber,
              orderId,
              flowType: FLOW_TYPES.PROGRAM_PRODUCT,
              duration,
              remaining: duration,
              status: 'processing',
              estimatedCompletionTime: new Date(Date.now() + duration * 1000).toISOString(),
            });
          }
        });

        // Clear selection when timers start
        clearMainPageSelection();

        log('__DEV: Temperature Control Complete', 'yellow', {
          location: location.pathname,
          calculatedDurations,
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

  // Check if there are any completed timers using TimersContext
  const { getCompletedTimers } = useTimers();
  const completedTimers = getCompletedTimers();
  const hasCompletedTimers = completedTimers.length > 0;

  // Check if there are any selected items using LayoutUIContext
  const hasSelectedItems = mainPageSelectedSlots.length > 0;

  const handleClearCompleted = useCallback(() => {
    startTransition(() => {
      // Clear all completed timers using the new TimerContext
      clearCompletedTimers();

      // Save new configuration to reset timer
      // Use selected slots from LayoutUiContext instead of order.isSelected
      const selectedOrders = mainPageSelectedSlots
        .map((slotNumber) => orders.find((order) => order.itemNumber === slotNumber))
        .filter(Boolean);
      saveConfig({
        filters: {},
        temperatures: { default: 25 },
        durations: { default: 300 },
        selectedOrders: selectedOrders.map((order) => order!.itemNumber),
      });
    });
  }, [clearCompletedTimers, orders, saveConfig, mainPageSelectedSlots]);

  const handleCancelCompleted = useCallback(() => {
    startTransition(() => {
      // Clear only timers that are SELECTED/checked
      const selectedSlotsWithTimers = mainPageSelectedSlots.filter((slotNumber) => {
        const timer = timers.find((t) => t.slotNumber === slotNumber);
        return timer && (timer.status === 'processing' || timer.status === 'completed');
      });

      console.log('handleCancelCompleted: Clearing timers for selected slots', selectedSlotsWithTimers);

      // Remove timers for selected slots
      selectedSlotsWithTimers.forEach((slotNumber) => {
        const timer = timers.find((t) => t.slotNumber === slotNumber);
        if (timer) {
          removeTimer(timer.id);
        }
      });

      // Clear selection for slots that had timers
      selectedSlotsWithTimers.forEach((slotNumber) => {
        if (mainPageSelectedSlots.includes(slotNumber)) {
          toggleMainPageSlot(slotNumber);
        }
      });

      // Save new configuration to reset timer
      // Use selected slots from LayoutUiContext instead of order.isSelected
      const selectedOrders = mainPageSelectedSlots
        .map((slotNumber) => orders.find((order) => order.itemNumber === slotNumber))
        .filter(Boolean);
      saveConfig({
        filters: {},
        temperatures: { default: 25 },
        durations: { default: 300 },
        selectedOrders: selectedOrders.map((order) => order!.itemNumber),
      });
    });
  }, [mainPageSelectedSlots, timers, removeTimer, toggleMainPageSlot, orders, saveConfig]);

  const handleSelectAll = useCallback(() => {
    startTransition(() => {
      // Use LayoutUIContext for MainPage selection
      selectAllMainPageSlots();
    });
  }, [selectAllMainPageSlots]);

  const handleStartProductProcess = useCallback(() => {
    log('__DEV: INICIAR - Temperature Process', 'yellow', {
      location: location.pathname,
    });

    // Only use temperature control if NOT on TimePage
    if (location.pathname !== ALTERNATIVE_PATHS.time) {
      startTemperatureControl();
    } else {
      console.warn('handleStartProductProcess: Called on TimePage but should use handleStartTimeProcess');
    }
  }, [startTemperatureControl, location.pathname]);

  const handleStartTimeProcess = useCallback(
    (duration: number) => {
      console.log('🚀 handleStartTimeProcess: Called with duration =', duration, 'seconds');
      console.log('🚀 handleStartTimeProcess: Current orders =', orders);
      log('__DEV: INICIAR - Time Process', 'yellow', {
        location: location.pathname,
        duration,
      });

      startTransition(() => {
        console.log('🚀 handleStartTimeProcess: Setting processing for selected orders');
        console.log('🚀 handleStartTimeProcess: Selected slots =', mainPageSelectedSlots);

        // Add timers to TimerContext for each selected slot
        mainPageSelectedSlots.forEach((slotNumber) => {
          console.log(
            '🚀 handleStartTimeProcess: Adding timer for slot',
            slotNumber,
            'with duration',
            duration,
          );

          // Check if there's already a timer for this slot
          const existingTimer = timers.find((t) => t.slotNumber === slotNumber);
          const orderId = existingTimer?.orderId || createCuid();

          console.log('🚀 handleStartTimeProcess: Timer details', {
            slotNumber,
            existingTimerId: existingTimer?.id,
            newOrderId: orderId,
            reusingOrderId: !!existingTimer?.orderId,
          });

          addTimer({
            sessionId: currentSessionId!,
            slotNumber,
            orderId,
            flowType: FLOW_TYPES.PROGRAM_TIME,
            duration,
            remaining: duration,
            status: 'processing',
            estimatedCompletionTime: new Date(Date.now() + duration * 1000).toISOString(),
          });
        });

        // 🎯 FIX: Clear selection when timers start
        // This ensures green color shows (no .selected override) and buttons are disabled
        clearMainPageSelection();

        log('__DEV: INICIAR - Time Process Complete', 'yellow', {
          location: location.pathname,
          duration,
        });

        // Navigate back to main page
        navigate(PATHS.main, { replace: true });
      });
    },
    [orders, addTimer, currentSessionId, navigate],
  );

  const handleProgramTime = useCallback(() => {
    startTransition(() => {
      // Get selected slots that are idle (not running timers)
      const selectedIdleSlots = mainPageSelectedSlots.filter((slotNumber) => {
        const timer = timers.find((t: any) => t.slotNumber === slotNumber);
        return !timer || (timer.status !== 'processing' && timer.status !== 'completed');
      });

      if (selectedIdleSlots.length === 0) {
        console.warn('No selected idle slots to program time for');
        return;
      }

      // Create orders for selected slots first
      selectedIdleSlots.forEach((slotNumber) => {
        const orderConfig = orderItemsConfig.find((config) => config.number === slotNumber);
        if (orderConfig) {
          toggleOrder({
            itemType: orderConfig.itemType,
            itemNumber: slotNumber,
          });
        }
      });

      // Create new session and assign selected slots
      const sessionId = createSession(FLOW_TYPES.PROGRAM_TIME);

      assignOrdersToSession(sessionId, selectedIdleSlots);
      setOrdersSession({
        orderNumbers: selectedIdleSlots,
        session: { id: sessionId, flowType: FLOW_TYPES.PROGRAM_TIME },
      });

      log('__DEV: PROGRAM TIME - Created session', 'blue', {
        sessionId,
        flowType: FLOW_TYPES.PROGRAM_TIME,
        selectedSlots: selectedIdleSlots,
      });

      // Navigate to time page
      navigate(ALTERNATIVE_PATHS.time);
    });
  }, [
    navigate,
    mainPageSelectedSlots,
    timers,
    createSession,
    assignOrdersToSession,
    setOrdersSession,
    toggleOrder,
    orderItemsConfig,
  ]);

  // ======================================================================== //

  const handleProgramProduct = useCallback(() => {
    startTransition(() => {
      // Get selected slots that are idle (not running timers)
      const selectedIdleSlots = mainPageSelectedSlots.filter((slotNumber) => {
        const timer = timers.find((t: any) => t.slotNumber === slotNumber);
        return !timer || (timer.status !== 'processing' && timer.status !== 'completed');
      });

      if (selectedIdleSlots.length === 0) {
        console.warn('No selected idle slots to program product for');
        return;
      }

      // Create orders for selected slots first
      selectedIdleSlots.forEach((slotNumber) => {
        const orderConfig = orderItemsConfig.find((config) => config.number === slotNumber);
        if (orderConfig) {
          toggleOrder({
            itemType: orderConfig.itemType,
            itemNumber: slotNumber,
          });
        }
      });

      // Create new session and assign selected slots
      const sessionId = createSession(FLOW_TYPES.PROGRAM_PRODUCT);

      assignOrdersToSession(sessionId, selectedIdleSlots);
      setOrdersSession({
        orderNumbers: selectedIdleSlots,
        session: { id: sessionId, flowType: FLOW_TYPES.PROGRAM_PRODUCT },
      });

      log('__DEV: PROGRAM PRODUCT - Created session', 'lime', {
        sessionId,
        flowType: FLOW_TYPES.PROGRAM_PRODUCT,
        selectedSlots: selectedIdleSlots,
      });

      // Navigate to first step of product configuration flow (drink type selection)
      const drinkTypePath = PATHS.drinkType;

      log('__DEV: PROGRAM PRODUCT - Navigation', 'yellow', {
        pathnames,
        drinkTypePath,
        currentPath: location.pathname,
      });

      // Set pagination to first step (index 1, since index 0 is main page)
      setPageCurrent(1);
      navigate(drinkTypePath); // Navigate directly to drink type page
    });
  }, [
    mainPageSelectedSlots,
    timers,
    createSession,
    assignOrdersToSession,
    setOrdersSession,
    pathnames,
    setPageCurrent,
    navigate,
    toggleOrder,
    orderItemsConfig,
  ]);

  const handleProgramProduct__V1 = useCallback(() => {
    startTransition(() => {
      // Get selected slots that are idle (not running timers)
      const selectedIdleSlots = mainPageSelectedSlots.filter((slotNumber) => {
        const timer = timers.find((t: any) => t.slotNumber === slotNumber);
        return !timer || (timer.status !== 'processing' && timer.status !== 'completed');
      });

      if (selectedIdleSlots.length === 0) {
        console.warn('No selected idle slots to program product for');
        return;
      }

      // Create new session and assign selected slots
      const sessionId = createSession(FLOW_TYPES.PROGRAM_PRODUCT);

      assignOrdersToSession(sessionId, selectedIdleSlots);
      setOrdersSession({
        orderNumbers: selectedIdleSlots,
        session: { id: sessionId, flowType: FLOW_TYPES.PROGRAM_PRODUCT },
      });

      log('__DEV: PROGRAM PRODUCT - Created session', 'lime', {
        sessionId,
        flowType: FLOW_TYPES.PROGRAM_PRODUCT,
        selectedSlots: selectedIdleSlots,
      });

      // Navigate to first step of product configuration flow (drink type selection)
      const drinkTypePath = PATHS.drinkType;

      log('__DEV: PROGRAM PRODUCT - Navigation', 'yellow', {
        pathnames,
        drinkTypePath,
        currentPath: location.pathname,
      });

      // Set pagination to first step (index 1, since index 0 is main page)
      setPageCurrent(1);
      navigate(drinkTypePath); // Navigate directly to drink type page
    });
  }, [
    mainPageSelectedSlots,
    timers,
    createSession,
    assignOrdersToSession,
    setOrdersSession,
    pathnames,
    setPageCurrent,
    navigate,
  ]);

  // ======================================================================== //

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
      // Use selected slots from LayoutUiContext instead of order.isSelected
      mainPageSelectedSlots.forEach((slotNumber) => {
        const order = orders.find((o) => o.itemNumber === slotNumber);
        if (order) {
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
  }, [orders, setOrderProcessing, mainPageSelectedSlots]);

  const getOperationDisabled = useCallback(
    (actionType: OperationActionType): boolean => {
      // Use mainPageSelectedSlots from top level (already available)

      // Count available slots (not running timers) for operations that need idle slots
      const numAvailableSelected = mainPageSelectedSlots.filter((slotNumber) => {
        const timer = timers.find((t: any) => t.slotNumber === slotNumber);
        return !timer || (timer.status !== 'processing' && timer.status !== 'completed');
      }).length;

      // Count any selected slots for UI state
      const numAnySelected = mainPageSelectedSlots.length;

      // Count selected processing timers for cancel button
      const numSelectedProcessing = mainPageSelectedSlots.filter((slotNumber) => {
        const timer = timers.find((t: any) => t.slotNumber === slotNumber);
        return timer && timer.status === 'processing';
      }).length;

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
      mainPageSelectedSlots,
      timers,
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
    handleStartProductProcess,
    handleStartTimeProcess,
    handleProgramTime,
    handleProgramProduct,
    handleRepeatSelection,
    getOperationDisabled,
    getOperationLoading,
    isOperationPending: isPending,
  };
};
