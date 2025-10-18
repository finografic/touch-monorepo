import { useCallback, useMemo, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import createCuid from '@bugsnag/cuid';
import { api } from 'api';
// import { useGetSlotConfigurations } from 'queries/slot-configurations';
import type { error } from 'console';

import { useFiltersContext } from 'providers/FiltersProvider';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useTimers } from 'providers/TimersProvider';

import { ALTERNATIVE_PATHS, PATHS } from 'config';
import { CONFIG_EXPIRY_TIME_MS, STORAGE_KEYS } from 'config/app';
import { useConfigStorage } from 'hooks/useConfigStorage';
import { useProcessTimesFromTemperatureFilter } from 'hooks/useProcessTimesFromTemperatureFilter';
import { useSlotItemsConfig } from 'hooks/useSlotItemsConfig';
import { FLOW_TYPES } from 'types/flow.types';
import { convertSlotConfigsToOrderConfig, getFallbackSlotsConfig } from 'utils/slot-config.utils';

type OperationActionType =
  | 'clear-completed'
  | 'cancel-completed'
  | 'select-all'
  | 'start-process'
  | 'finish-product-process'
  | 'program-time'
  | 'program-product'
  | 'repeat-selection'
  | 'cancel-time-session'
  | 'cancel-product-session';

interface UseButtonOperationsReturn {
  handleClearCompleted: () => void;
  handleCancelCompleted: () => void;
  handleSelectAll: () => void;
  handleStartProductProcess: () => void;
  handleFinishProductProcess: () => void;
  handleStartTimeProcess: (duration: number) => void;
  handleProgramTime: () => void;
  handleProgramProduct: () => void;
  handleRepeatSelection: () => void;
  handleCancelTimeSession: () => void;
  handleCancelProductSession: () => void;
  getOperationDisabled: (actionType: OperationActionType) => boolean;
  getOperationLoading: (actionType: OperationActionType) => boolean;
  isOperationPending: boolean;
}

// TODO: SPLIT UP THIS FILE ??
// MainPageOps vs TemperatureOps vs ProductOps ??
// Timers
// etc..
export const useButtonOperations = (): UseButtonOperationsReturn => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const { setPageCurrent } = usePagination();
  const { orders, toggleSlot, setOrdersSession, profile } = useOrders();
  const {
    createSession,
    assignOrdersToSession,
    currentSessionId,
    clearSession,
    updateSessionFilters,
    completeSession,
  } = useSession();
  const { addTimer, clearCompletedTimers, timers, removeTimer } = useTimers();
  const {
    selectAllMainPageSlots,
    clearMainPageSelection,
    toggleMainPageSlot,
    mainPageSelectedSlots,
    setMainPageSelectedSlots,
  } = useLayoutUi();
  const { saveConfig } = useConfigStorage();
  const orderItemsConfig = useSlotItemsConfig();
  // const { data: slotConfigs, isLoading, error } = useGetSlotConfigurations();
  const { setFilter, clearFilters, filters } = useFiltersContext();

  // console.log('%c loop? 2', 'color:grey', orders);

  // const orderItemsConfig = useMemo(() => {
  //   if (isLoading || error || !slotConfigs || slotConfigs.length === 0) {
  //     return getFallbackSlotsConfig();
  //   }
  //   try {
  //     return convertSlotConfigsToOrderConfig(slotConfigs);
  //   } catch (error) {
  //     console.error('Error converting slot configs:', error);
  //     return getFallbackSlotsConfig();
  //   }
  // }, [slotConfigs, isLoading, error]);

  // Determine which slots to process (same logic used in onSuccess)

  const slotsToProcess = useMemo(() => {
    return mainPageSelectedSlots.length > 0
      ? mainPageSelectedSlots.map((slot) => slot.slotNumber)
      : orders.filter((order) => order.isSelected).map((order) => order.slotNumber);
  }, [mainPageSelectedSlots, orders]);

  const { startTemperatureControl, isLoading: isTemperatureLoading } = useProcessTimesFromTemperatureFilter({
    selectedSlots: mainPageSelectedSlots,
    onSuccess: useCallback(
      (calculatedDurations) => {
        startTransition(function updateProcessForSelectedOrders() {
          slotsToProcess.forEach((slotNumber) => {
            const order = orders.find((o) => o.slotNumber === slotNumber);
            if (order) {
              const duration = calculatedDurations[order.slotNumber.toString()];
              const existingTimer = timers.find((t) => t.slotNumber === slotNumber);
              const orderId = existingTimer?.orderId || createCuid();

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

          clearMainPageSelection();

          // 🎯 FIX: Mark the current session as complete when flow finishes
          if (currentSessionId) {
            completeSession(currentSessionId);
          }

          setPageCurrent(0);
          navigate(PATHS.main, { replace: true });
        });
      },
      [
        orders,
        mainPageSelectedSlots,
        timers,
        addTimer,
        currentSessionId,
        clearMainPageSelection,
        completeSession,
        setPageCurrent,
        navigate,
      ],
    ),

    onError: useCallback((error) => {
      // TODO: Show error message to user
      console.error('Failed to control temperature:', error);
    }, []),
  });

  // Check if there are any completed timers using TimersContext
  const { getCompletedTimers } = useTimers();
  const completedTimers = getCompletedTimers();
  const hasCompletedTimers = completedTimers.length > 0;
  const isTimerSelected = mainPageSelectedSlots.some(({ status }) => status === 'processing');

  // Check if there are any selected items using LayoutUIContext
  const hasSelectedItems = mainPageSelectedSlots.length > 0;

  const handleClearCompleted = useCallback(() => {
    startTransition(() => {
      // Clear all completed timers using the new TimerContext
      clearCompletedTimers();

      // Save new configuration to reset timer
      // Use selected slots from LayoutUiContext instead of order.isSelected
      const selectedOrders = mainPageSelectedSlots
        .map((slot) => orders.find((order) => order.slotNumber === slot.slotNumber))
        .filter(Boolean);
      saveConfig({
        filters: {},
        temperatures: { default: 25 },
        durations: { default: 300 },
        selectedOrders: selectedOrders.map((order) => order!.slotNumber),
      });
    });
  }, [clearCompletedTimers, orders, saveConfig, mainPageSelectedSlots]);

  const handleCancelCompleted = useCallback(() => {
    startTransition(() => {
      // Clear only timers that are SELECTED/checked
      const selectedSlotsWithTimers = mainPageSelectedSlots.filter((slot) => {
        const timer = timers.find((t) => t.slotNumber === slot.slotNumber);
        return timer && (timer.status === 'processing' || timer.status === 'completed');
      });

      // Remove timers for selected slots
      selectedSlotsWithTimers.forEach((slot) => {
        const timer = timers.find((t) => t.slotNumber === slot.slotNumber);
        if (timer) {
          removeTimer(timer.id);
        }
      });

      // Clear selection for slots that had timers
      selectedSlotsWithTimers.forEach((slot) => {
        toggleMainPageSlot(slot);
      });

      // Save new configuration to reset timer
      // Use selected slots from LayoutUiContext instead of order.isSelected
      const selectedOrders = mainPageSelectedSlots
        .map((slot) => orders.find((order) => order.slotNumber === slot.slotNumber))
        .filter(Boolean);
      saveConfig({
        filters: {},
        temperatures: { default: 25 },
        durations: { default: 300 },
        selectedOrders: selectedOrders.map((order) => order!.slotNumber),
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
    startTemperatureControl();
  }, [startTemperatureControl]);

  // 🎯 NEW: Handle finishing product process (TemperaturePage START button)
  const handleFinishProductProcess = useCallback(() => {
    console.log('🎯 FINISH: Starting finish product process...');
    startTemperatureControl();
  }, [startTemperatureControl]);

  const handleStartTimeProcess = useCallback(
    (duration: number) => {
      startTransition(() => {
        // Add timers to TimerContext for each selected slot
        mainPageSelectedSlots.forEach((slot) => {
          // Check if there's already a timer for this slot
          const existingTimer = timers.find((t) => t.slotNumber === slot.slotNumber);
          const orderId = existingTimer?.orderId || createCuid();

          addTimer({
            sessionId: currentSessionId!,
            slotNumber: slot.slotNumber,
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

        // Navigate back to main page
        navigate(PATHS.main, { replace: true });
      });
    },
    [orders, addTimer, currentSessionId, navigate],
  );

  const handleProgramTime = useCallback(() => {
    startTransition(() => {
      // Get selected slots that are idle (not running timers)
      const selectedIdleSlots = mainPageSelectedSlots.filter((slot) => {
        const timer = timers.find((t: any) => t.slotNumber === slot.slotNumber);
        return !timer || (timer.status !== 'processing' && timer.status !== 'completed');
      });

      if (selectedIdleSlots.length === 0) {
        console.warn('No selected idle slots to program time for');
        return;
      }

      // Create orders for selected slots first
      selectedIdleSlots.forEach((slot) => {
        const orderConfig = orderItemsConfig.find((config) => config.slotNumber === slot.slotNumber);
        if (orderConfig) {
          toggleSlot({
            slotType: orderConfig.slotType,
            slotNumber: slot.slotNumber,
          });
        }
      });

      // Create new session and assign selected slots
      const sessionId = createSession(FLOW_TYPES.PROGRAM_TIME);

      assignOrdersToSession(
        sessionId,
        selectedIdleSlots.map((slot) => slot.slotNumber),
      );
      setOrdersSession({
        slotNumbers: selectedIdleSlots.map((slot) => slot.slotNumber),
        session: { id: sessionId, flowType: FLOW_TYPES.PROGRAM_TIME },
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
    toggleSlot,
    orderItemsConfig,
  ]);

  // ======================================================================== //

  const handleProgramProduct = useCallback(() => {
    // 🚀 PERFORMANCE OPTIMIZATION: Use Maps for O(n) lookups
    const timerMap = new Map(timers.map((t) => [t.slotNumber, t]));
    const orderConfigMap = new Map(orderItemsConfig.map((config) => [config.slotNumber, config]));
    const ordersMap = new Map(orders.map((order) => [order.slotNumber, order]));

    // Get selected slots that are idle (not running timers)
    const selectedIdleSlots = mainPageSelectedSlots.filter((slot) => {
      const timer = timerMap.get(slot.slotNumber);
      return !timer || (timer.status !== 'processing' && timer.status !== 'completed');
    });

    if (selectedIdleSlots.length === 0) {
      console.warn('No selected idle slots to program product for');
      return;
    }

    startTransition(() => {
      // Create orders for selected slots first and ensure they are selected
      selectedIdleSlots.forEach((slot) => {
        const orderConfig = orderConfigMap.get(slot.slotNumber);
        if (orderConfig) {
          // Check if order already exists and is selected
          const existingOrder = ordersMap.get(slot.slotNumber);
          if (!existingOrder || !existingOrder.isSelected) {
            toggleSlot({
              slotType: orderConfig.slotType,
              slotNumber: slot.slotNumber,
            });
          }
        }
      });

      // Create new session and assign selected slots
      const sessionId = createSession(FLOW_TYPES.PROGRAM_PRODUCT, { mode: filters.mode });

      assignOrdersToSession(
        sessionId,
        selectedIdleSlots.map((slot) => slot.slotNumber),
      );
      setOrdersSession({
        slotNumbers: selectedIdleSlots.map((slot) => slot.slotNumber),
        session: { id: sessionId, flowType: FLOW_TYPES.PROGRAM_PRODUCT },
      });
    });

    // 🚀 PERFORMANCE OPTIMIZATION: Get mode from localStorage instead of API call
    try {
      const storedMode = localStorage.getItem('defaultMode');
      if (storedMode) {
        const modeFilter = JSON.parse(storedMode);
        setFilter('mode', modeFilter);
      } else {
        console.warn('🔍 handleProgramProduct: No default mode found in localStorage');
      }
    } catch (error) {
      console.error('🔍 handleProgramProduct: Error parsing stored mode:', error);
    }

    // Navigate to first step of product configuration flow (drink type selection)
    const drinkTypePath = PATHS.drinkType;

    // Set pagination to first step (index 1, since index 0 is main page)
    setPageCurrent(1);
    navigate(drinkTypePath); // Navigate directly to drink type page
  }, [
    mainPageSelectedSlots,
    timers,
    createSession,
    assignOrdersToSession,
    setOrdersSession,
    setPageCurrent,
    navigate,
    toggleSlot,
    orderItemsConfig,
    orders,
    setFilter,
  ]);

  // ======================================================================== //

  const handleRepeatSelection = useCallback(() => {
    const selectedIdleSlots = mainPageSelectedSlots.filter(({ status }) => status === 'idle');
    // log('__TEST:', 'orange', clearMainPageSelection);
    // setMainPageSelectedSlots(mainPageSelectedSlots);
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

    startTransition(() => {
      // Apply configuration to all selected orders
      // Use selected slots from LayoutUiContext and map by slotType from orderItemsConfig
      mainPageSelectedSlots.forEach((slot) => {
        // Get slotType from orderItemsConfig instead of orders array
        const orderConfig = orderItemsConfig.find((config) => config.slotNumber === slot.slotNumber);

        if (orderConfig) {
          // Get duration for this specific item type from saved config
          // Use slotType (A, B, C) to get the correct duration
          const slotTypeDuration = config.durations?.[orderConfig.slotType];
          const defaultDuration = config.durations?.default;
          const duration = slotTypeDuration || defaultDuration || 300;

          log('__TEST:', 'orange', slot, orderConfig);
          const updatedSlots = mainPageSelectedSlots.filter((s) => s.slotNumber !== slot.slotNumber);
          setMainPageSelectedSlots(updatedSlots);

          // Create timer using the same logic as handleStartTimeProcess
          addTimer({
            sessionId: currentSessionId || 'repeat-session',
            slotNumber: slot.slotNumber,
            orderId: createCuid(),
            flowType: FLOW_TYPES.PROGRAM_PRODUCT,
            duration,
            remaining: duration,
            status: 'processing',
            estimatedCompletionTime: new Date(Date.now() + duration * 1000).toISOString(),
          });
        }
      });
    });
  }, [mainPageSelectedSlots, addTimer, orderItemsConfig, currentSessionId]);

  const handleCancelTimeSession = useCallback(() => {
    startTransition(() => {
      // Only proceed if we're on the TimePage
      if (location.pathname !== ALTERNATIVE_PATHS.time) {
        console.warn('handleCancelTimeSession: Called but not on TimePage');
        return;
      }

      // Remove the current session
      if (currentSessionId) {
        console.log('Cancelling time session:', currentSessionId);

        // Clear any orders that were created for this session
        const sessionOrders = orders.filter((order) => order.session?.id === currentSessionId);
        sessionOrders.forEach((order) => {
          toggleSlot({
            slotType: order.slotType,
            slotNumber: order.slotNumber,
          });
        });

        // Remove the session from SessionContext
        clearSession(currentSessionId);
      }

      // Navigate back to main page
      navigate(PATHS.main, { replace: true });
    });
  }, [location.pathname, currentSessionId, orders, toggleSlot, navigate, clearSession]);

  const handleCancelProductSession = useCallback(() => {
    startTransition(() => {
      // Only proceed if we're on a product flow page (drinkType, drinkSubtype, etc.)
      const productFlowPages = [
        PATHS.drinkType,
        PATHS.drinkSubtype,
        PATHS.drinkVolume,
        PATHS.containerType,
        PATHS.temperature,
      ];

      if (!productFlowPages.includes(location.pathname as any)) {
        console.warn('handleCancelProductSession: Called but not on a product flow page');
        return;
      }

      // Remove the current session
      if (currentSessionId) {
        console.log('Cancelling product session:', currentSessionId);

        // Clear any orders that were created for this session
        const sessionOrders = orders.filter((order) => order.session?.id === currentSessionId);
        sessionOrders.forEach((order) => {
          toggleSlot({
            slotType: order.slotType,
            slotNumber: order.slotNumber,
          });
        });

        // Remove the session from SessionContext
        clearSession(currentSessionId);
        // Clear all filters from FiltersContext
        clearFilters();
      }

      // Navigate back to main page
      navigate(PATHS.main, { replace: true });
    });
  }, [location.pathname, currentSessionId, orders, toggleSlot, navigate, clearSession, clearFilters]);

  const getOperationDisabled = useCallback(
    (actionType: OperationActionType): boolean => {
      // 🚀 PERFORMANCE OPTIMIZATION: Use Map for O(n) timer lookups
      const timerMap = new Map(timers.map((t) => [t.slotNumber, t]));

      // Count available slots (not running timers) for operations that need idle slots
      const numAvailableSelected = mainPageSelectedSlots.filter((slot) => {
        const timer = timerMap.get(slot.slotNumber);
        return !timer || (timer.status !== 'processing' && timer.status !== 'completed');
      }).length;

      // Count any selected slots for UI state
      const numAnySelected = mainPageSelectedSlots.length;

      // Count selected processing timers for cancel button
      const numSelectedProcessing = mainPageSelectedSlots.filter((slot) => {
        const timer = timerMap.get(slot.slotNumber);
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
          return (
            isTemperatureLoading ||
            isPending ||
            !profile?.temperatureProfiles?.length || // ✅ Check if we have temperature profiles
            location.pathname !== PATHS.temperature
          );
        case 'program-time':
          // Enable only if there are selected IDLE orders (can't program time for running/completed timers)
          return numAvailableSelected === 0 || location.pathname !== PATHS.main || isPending;
        case 'program-product':
          // Enable only if there are selected IDLE orders (can't program product for running/completed timers)
          return numAvailableSelected === 0 || location.pathname !== PATHS.main || isPending;
        case 'repeat-selection': {
          if (isTimerSelected) return true;
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
        case 'cancel-time-session':
          // Always enabled on TimePage (no conditions)
          return false;
        case 'cancel-product-session':
          // Always enabled on product flow pages (no conditions)
          return false;
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
    handleFinishProductProcess,
    handleStartTimeProcess,
    handleProgramTime,
    handleProgramProduct,
    handleRepeatSelection,
    handleCancelTimeSession,
    handleCancelProductSession,
    getOperationDisabled,
    getOperationLoading,
    isOperationPending: isPending,
  };
};
