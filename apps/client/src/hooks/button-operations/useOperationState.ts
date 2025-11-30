import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useOrders } from 'providers/OrdersProvider';
import { useTimers } from 'providers/TimersProvider';

import { ALTERNATIVE_PATHS, PATHS } from 'config/routes';
import { BUTTON_TYPE } from 'types/button.types';
import type { OperationActionType } from './button-operations.types';

/**
 * Shared logic for determining operation disabled/loading states
 */
export const useOperationState = (
  mainPagePending: boolean,
  timeFlowPending: boolean,
  productFlowPending: boolean,
  isTemperatureLoading: boolean,
) => {
  const location = useLocation();
  const { selectedSlots } = useLayoutUi();
  const { timers, recall, isRecallExpired } = useTimers();
  const { profile } = useOrders();

  // const completedTimers = getCompletedTimers();
  const completedTimers = timers.filter((timer) => timer.status === 'completed');
  const hasCompletedTimers = completedTimers.length > 0;
  const hasSelectedItems = selectedSlots.length > 0;
  const isTimerSelected = selectedSlots.some(({ status }) => status === 'processing');

  // Combined pending state
  const isPending = mainPagePending || timeFlowPending || productFlowPending;

  const getOperationDisabled = useCallback(
    (actionType: OperationActionType): boolean => {
      // Performance optimization: Use Map for O(n) timer lookups
      const timerMap = new Map(timers.map((t) => [t.slotNumber, t]));

      // Count available slots (not running timers) for operations that need idle slots
      const numAvailableSelected = selectedSlots.filter((slot) => {
        const timer = timerMap.get(slot.slotNumber);
        return !timer || (timer.status !== 'processing' && timer.status !== 'completed');
      }).length;

      // Count any selected slots for UI state
      const numAnySelected = selectedSlots.length;

      // Count selected processing timers for cancel button
      const numSelectedProcessing = selectedSlots.filter((slot) => {
        const timer = timerMap.get(slot.slotNumber);
        return timer && timer.status === 'processing';
      }).length;

      switch (actionType) {
        case BUTTON_TYPE.RESET_COMPLETED:
          return !hasCompletedTimers || location.pathname !== PATHS.main || isPending;
        case BUTTON_TYPE.CANCEL_SELECTED:
          return numSelectedProcessing === 0 || location.pathname !== PATHS.main || isPending;
        case BUTTON_TYPE.SELECT_ALL_SLOTS:
          return location.pathname !== PATHS.main || isPending;
        case BUTTON_TYPE.START_PRODUCT_PROCESS:
          // On TimePage: check if we have selected items
          if (location.pathname === ALTERNATIVE_PATHS.time) {
            return !hasSelectedItems || isPending;
          }
          return (
            isTemperatureLoading ||
            isPending ||
            !profile?.temperatureProfiles?.length || // Check if we have temperature profiles
            location.pathname !== PATHS.temperature
          );
        case BUTTON_TYPE.PROGRAM_TIME:
          // Enable only if there are selected IDLE orders
          return numAvailableSelected === 0 || location.pathname !== PATHS.main || isPending;
        case BUTTON_TYPE.PROGRAM_PRODUCT:
          // Enable only if there are selected IDLE orders
          return numAvailableSelected === 0 || location.pathname !== PATHS.main || isPending;
        case BUTTON_TYPE.REPEAT_SELECTION: {
          if (isTimerSelected) return true;
          // Check if recall config is active (exists and not expired)
          const hasActiveRecall = recall.config !== null && !isRecallExpired();

          // Enable only if: recall config active + orders selected + on main page
          return !hasActiveRecall || numAnySelected === 0 || location.pathname !== PATHS.main || isPending;
        }
        case BUTTON_TYPE.CANCEL_TIME_SESSION:
          // Always enabled on TimePage
          return false;
        case BUTTON_TYPE.CANCEL_PRODUCT_SESSION:
          // Always enabled on product flow pages
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
      selectedSlots,
      timers,
      profile?.temperatureProfiles?.length,
      isTimerSelected,
    ],
  );

  const getOperationLoading = useCallback(
    (actionType: OperationActionType): boolean => {
      switch (actionType) {
        case BUTTON_TYPE.START_PRODUCT_PROCESS:
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
    getOperationDisabled,
    getOperationLoading,
    isOperationPending: isPending,
  };
};
