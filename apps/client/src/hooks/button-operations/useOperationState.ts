import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useOrders } from 'providers/OrdersProvider';
import { useTimers } from 'providers/TimersProvider';

import { ALTERNATIVE_PATHS, PATHS } from 'config';
import { CONFIG_EXPIRY_TIME_MS, STORAGE_KEYS } from 'config/app';
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
  const { mainPageSelectedSlots } = useLayoutUi();
  const { timers, getCompletedTimers } = useTimers();
  const { profile } = useOrders();

  const completedTimers = getCompletedTimers();
  const hasCompletedTimers = completedTimers.length > 0;
  const hasSelectedItems = mainPageSelectedSlots.length > 0;
  const isTimerSelected = mainPageSelectedSlots.some(({ status }) => status === 'processing');

  // Combined pending state
  const isPending = mainPagePending || timeFlowPending || productFlowPending;

  const getOperationDisabled = useCallback(
    (actionType: OperationActionType): boolean => {
      // Performance optimization: Use Map for O(n) timer lookups
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
            !profile?.temperatureProfiles?.length || // Check if we have temperature profiles
            location.pathname !== PATHS.temperature
          );
        case 'finish-product-process':
          return (
            isTemperatureLoading ||
            isPending ||
            !profile?.temperatureProfiles?.length ||
            location.pathname !== PATHS.temperature
          );
        case 'program-time':
          // Enable only if there are selected IDLE orders
          return numAvailableSelected === 0 || location.pathname !== PATHS.main || isPending;
        case 'program-product':
          // Enable only if there are selected IDLE orders
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
          // Always enabled on TimePage
          return false;
        case 'cancel-product-session':
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
      mainPageSelectedSlots,
      timers,
      profile?.temperatureProfiles?.length,
      isTimerSelected,
    ],
  );

  const getOperationLoading = useCallback(
    (actionType: OperationActionType): boolean => {
      switch (actionType) {
        case 'start-process':
        case 'finish-product-process':
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
