import { useCallback, useMemo, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import createCuid from '@bugsnag/cuid';
import { useFiltersContext } from 'providers/FiltersProvider';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useTimers } from 'providers/TimersProvider';

import { useProcessTimesFromTemperatureFilter } from 'hooks/useProcessTimesFromTemperatureFilter';
import { useSlotItemsConfig } from 'hooks/useSlotItemsConfig';
import { FLOW_TYPES } from 'types/flow.types';

import { PATHS } from 'config';

/**
 * Handles Product Flow operations:
 * - Programming product (MainPage → DrinkType → ... → Temperature)
 * - Starting product process (DrinkType page)
 * - Finishing product process (Temperature page)
 * - Canceling product session
 */
export const useProductFlowOperations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const { setPageCurrent } = usePagination();
  const { orders, toggleSlot, setOrdersSession } = useOrders();
  const { createSession, assignOrdersToSession, currentSessionId, clearSession, completeSession } =
    useSession();
  const { addTimer, timers } = useTimers();
  const { mainPageSelectedSlots, clearMainPageSelection } = useLayoutUi();
  const { setFilter, clearFilters, filters } = useFiltersContext();
  const orderItemsConfig = useSlotItemsConfig();

  // Determine which slots to process
  const slotsToProcess = useMemo(() => {
    return mainPageSelectedSlots.length > 0
      ? mainPageSelectedSlots.map((slot) => slot.slotNumber)
      : orders.filter((order) => order.isSelected).map((order) => order.slotNumber);
  }, [mainPageSelectedSlots, orders]);

  // ========================================================================
  // TEMPERATURE CONTROL HOOK
  // ========================================================================

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

          // Mark the current session as complete when flow finishes
          if (currentSessionId) {
            completeSession(currentSessionId);
          }

          setPageCurrent(0);
          navigate(PATHS.main, { replace: true });
        });
      },
      [
        slotsToProcess,
        orders,
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
      console.error('Failed to control temperature:', error);
    }, []),
  });

  // ========================================================================
  // PROGRAM PRODUCT (MainPage → DrinkType page)
  // ========================================================================

  const handleProgramProduct = useCallback(() => {
    // Performance optimization: Use Maps for O(n) lookups
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

    // Performance optimization: Get mode from localStorage instead of API call
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
    navigate(drinkTypePath);
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
    filters.mode,
  ]);

  // ========================================================================
  // START PRODUCT PROCESS (DrinkType page)
  // ========================================================================

  const handleStartProductProcess = useCallback(() => {
    startTemperatureControl();
  }, [startTemperatureControl]);

  // ========================================================================
  // FINISH PRODUCT PROCESS (Temperature page START button)
  // ========================================================================

  const handleFinishProductProcess = useCallback(() => {
    console.log('🎯 FINISH: Starting finish product process...');
    startTemperatureControl();
  }, [startTemperatureControl]);

  // ========================================================================
  // CANCEL PRODUCT SESSION
  // ========================================================================

  const handleCancelProductSession = useCallback(() => {
    startTransition(() => {
      // Only proceed if we're on a product flow page
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

  return {
    handleProgramProduct,
    handleStartProductProcess,
    handleFinishProductProcess,
    handleCancelProductSession,
    isTemperatureLoading,
    isPending,
  };
};
