import { useCallback, useMemo, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import createCuid from '@bugsnag/cuid';

import { useSlotItemsConfig } from 'hooks/useSlotItemsConfig';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useOrders } from 'providers/OrdersProvider';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useTimers } from 'providers/TimersProvider';

import { FLOW_TYPES } from 'types/flow.types';
import { ALTERNATIVE_PATHS, PATHS } from 'config/routes';
import { filterSlotsAvailable } from './timer-filter.utils';

/**
 * Handles Time Flow operations:
 * - Programming time (MainPage → TimePage)
 * - Starting time process (TimePage → MainPage with timers)
 * - Canceling time session
 */
export const useTimeFlowOperations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const { orders, toggleSlot, setOrdersSession } = useOrders();
  const { createSession, assignOrdersToSession, currentSessionId, clearSession } = useSession();
  const { addTimer, timers } = useTimers();
  const { selectedSlots, clearMainPageSelection } = useLayoutUi();
  const orderItemsConfig = useSlotItemsConfig();

  // ========================================================================
  // PROGRAM TIME (MainPage → TimePage)
  // ========================================================================

  const handleProgramTime = useCallback(() => {
    startTransition(() => {
      const selectedIdleSlots = selectedSlots.filter((slot) => {
        const timer = timers.find((t: any) => t.slotNumber === slot.slotNumber);
        return !timer || (timer.status !== 'processing' && timer.status !== 'completed');
      });

      if (selectedIdleSlots.length === 0) {
        console.warn('No selected idle slots to program time for');
      }

      log('__DEV: sessionId', 'orange', selectedIdleSlots);

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
    selectedSlots,
    timers,
    createSession,
    assignOrdersToSession,
    setOrdersSession,
    toggleSlot,
    orderItemsConfig,
  ]);

  // ========================================================================
  // START TIME PROCESS (TimePage → MainPage with timers)
  // ========================================================================

  const handleStartTimeProcess = useCallback(
    (duration: number) => {
      startTransition(() => {
        // Filter out slots that have timers with status "processing" or "completed"
        const slotsToProcess = filterSlotsAvailable(selectedSlots, timers);

        // Add timers to TimerContext for each filtered slot
        slotsToProcess.forEach((slot) => {
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
            completionTime: new Date(Date.now() + duration * 1000).toISOString(),
          });
        });

        // Clear selection when timers start (ensures green color shows)
        clearMainPageSelection();

        // Navigate back to main page with state indicating flow completion (not cancellation)
        navigate(PATHS.main, {
          replace: true,
          state: { flowCompleted: true, flowType: FLOW_TYPES.PROGRAM_TIME },
        });
      });
    },
    [selectedSlots, addTimer, currentSessionId, clearMainPageSelection, navigate, timers],
  );

  // ========================================================================
  // CANCEL TIME SESSION
  // ========================================================================

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

  return {
    handleProgramTime,
    handleStartTimeProcess,
    handleCancelTimeSession,
    isPending,
  };
};
