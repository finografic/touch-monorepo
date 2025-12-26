import { useCallback, useMemo } from 'react';
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
  const { orders, toggleSlot, setOrdersSession } = useOrders();
  const { createSession, assignOrdersToSession, currentSessionId, clearSession } = useSession();
  const { addTimer, timers } = useTimers();
  const { selectedSlots, setSelectedSlots } = useLayoutUi();
  const { itemsBySlot: slotItemsBySlot } = useSlotItemsConfig();

  // Precompute active timer slots
  const timerSlots = useMemo(() => {
    return new Set(timers.map((t) => t.slotNumber));
  }, [timers]);

  // ========================================================================
  // PROGRAM TIME (MainPage → TimePage)
  // ========================================================================

  const handleProgramTime = useCallback(() => {
    // Determine which slots are idle
    const selectedIdleSlots = selectedSlots.filter((slot) => !timerSlots.has(slot.slotNumber));

    if (selectedIdleSlots.length === 0) {
      console.warn('No selected idle slots to program time for');
    }

    // Create orders for selected slots using Map lookup
    for (const slot of selectedIdleSlots) {
      const orderConfig = slotItemsBySlot.get(slot.slotNumber);
      if (orderConfig) {
        toggleSlot({
          slotType: orderConfig.slotType,
          slotNumber: slot.slotNumber,
        });
      }
    }

    const sessionId = createSession(FLOW_TYPES.PROGRAM_TIME);

    const slotNumbers = selectedIdleSlots.map((s) => s.slotNumber);

    assignOrdersToSession(sessionId, slotNumbers);

    setOrdersSession({
      slotNumbers,
      session: { id: sessionId, flowType: FLOW_TYPES.PROGRAM_TIME },
    });

    navigate(ALTERNATIVE_PATHS.time);
  }, [
    selectedSlots,
    toggleSlot,
    createSession,
    assignOrdersToSession,
    setOrdersSession,
    navigate,
    slotItemsBySlot,
    timerSlots,
  ]);

  // ========================================================================
  // START TIME PROCESS (TimePage → MainPage)
  // ========================================================================

  const handleStartTimeProcess = useCallback(
    (duration: number) => {
      const slotsToProcess = filterSlotsAvailable(selectedSlots, timers);

      for (const slot of slotsToProcess) {
        const existingTimer = timers.find((t) => t.slotNumber === slot.slotNumber);
        const orderId = existingTimer?.orderId ?? createCuid();

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
      }

      setSelectedSlots([]);

      navigate(PATHS.main, {
        replace: true,
        state: { flowCompleted: true, flowType: FLOW_TYPES.PROGRAM_TIME },
      });
    },
    [selectedSlots, addTimer, currentSessionId, setSelectedSlots, navigate, timers],
  );

  // ========================================================================
  // CANCEL TIME SESSION
  // ========================================================================

  const handleCancelTimeSession = useCallback(() => {
    if (location.pathname !== ALTERNATIVE_PATHS.time) {
      console.warn('handleCancelTimeSession: Called but not on TimePage');
      return;
    }

    if (currentSessionId) {
      const sessionOrders = orders.filter((o) => o.session?.id === currentSessionId);
      for (const order of sessionOrders) {
        toggleSlot({
          slotType: order.slotType,
          slotNumber: order.slotNumber,
        });
      }

      clearSession(currentSessionId);
    }

    navigate(PATHS.main, { replace: true });
  }, [location.pathname, currentSessionId, orders, toggleSlot, navigate, clearSession]);

  return {
    handleProgramTime,
    handleStartTimeProcess,
    handleCancelTimeSession,
    isPending: false,
  };
};
