import { useCallback, useTransition } from 'react';

import createCuid from '@bugsnag/cuid';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useOrders } from 'providers/OrdersProvider';
import { useTimers } from 'providers/TimersProvider';

import { useConfigStorage } from 'hooks/useConfigStorage';
import { useSlotItemsConfig } from 'hooks/useSlotItemsConfig';

import { FLOW_TYPES } from 'types/flow.types';
import { CONFIG_EXPIRY_TIME_MS, STORAGE_KEYS } from 'config/app';

/**
 * Handles MainPage-specific operations:
 * - Timer management (clear/cancel completed)
 * - Selection operations (select all)
 * - Repeat last configuration
 */
export const useMainPageOperations = () => {
  const [isPending, startTransition] = useTransition();
  const { orders } = useOrders();
  const { addTimer, clearCompletedTimers, timers, removeTimer } = useTimers();
  const {
    selectAllMainPageSlots,
    clearMainPageSelection,
    toggleMainPageSlot,
    selectedSlots,
    setSelectedSlots,
  } = useLayoutUi();
  const { saveConfig } = useConfigStorage();
  const orderItemsConfig = useSlotItemsConfig();

  // ========================================================================
  // TIMER OPERATIONS
  // ========================================================================

  const handleClearCompleted = useCallback(() => {
    startTransition(() => {
      // Clear all completed timers using the new TimerContext
      clearCompletedTimers();

      // Save new configuration to reset timer
      const selectedOrders = selectedSlots
        .map((slot) => orders.find((order) => order.slotNumber === slot.slotNumber))
        .filter(Boolean);
      saveConfig({
        filters: {},
        temperatures: { default: 25 },
        durations: { default: 300 },
        selectedOrders: selectedOrders.map((order) => order!.slotNumber),
      });
    });
  }, [clearCompletedTimers, orders, saveConfig, selectedSlots]);

  const handleCancelCompleted = useCallback(() => {
    startTransition(() => {
      // Clear only timers that are SELECTED/checked
      const selectedSlotsWithTimers = selectedSlots.filter((slot) => {
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
      const selectedOrders = selectedSlots
        .map((slot) => orders.find((order) => order.slotNumber === slot.slotNumber))
        .filter(Boolean);
      saveConfig({
        filters: {},
        temperatures: { default: 25 },
        durations: { default: 300 },
        selectedOrders: selectedOrders.map((order) => order!.slotNumber),
      });
    });
  }, [selectedSlots, timers, removeTimer, toggleMainPageSlot, orders, saveConfig]);

  // ========================================================================
  // SELECTION OPERATIONS
  // ========================================================================

  const handleSelectAll = useCallback(() => {
    startTransition(() => {
      selectAllMainPageSlots();
    });
  }, [selectAllMainPageSlots]);

  // ========================================================================
  // REPEAT CONFIGURATION
  // ========================================================================

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

    startTransition(() => {
      // Apply configuration to all selected orders
      selectedSlots.forEach((slot) => {
        const orderConfig = orderItemsConfig.find((cfg) => cfg.slotNumber === slot.slotNumber);

        if (orderConfig) {
          // Get duration for this specific item type from saved config
          const slotTypeDuration = config.durations?.[orderConfig.slotType];
          const defaultDuration = config.durations?.default;
          const duration = slotTypeDuration || defaultDuration || 300;

          const updatedSlots = selectedSlots.filter((s) => s.slotNumber !== slot.slotNumber);
          setSelectedSlots(updatedSlots);

          // Create timer using the same logic as handleStartTimeProcess
          addTimer({
            sessionId: 'repeat-session',
            slotNumber: slot.slotNumber,
            orderId: createCuid(),
            flowType: FLOW_TYPES.PROGRAM_PRODUCT,
            duration,
            status: 'processing',
            completionTime: new Date(Date.now() + duration * 1000).toISOString(),
          });
        }
      });
    });
  }, [selectedSlots, addTimer, orderItemsConfig, setSelectedSlots]);

  return {
    handleClearCompleted,
    handleCancelCompleted,
    handleSelectAll,
    handleRepeatSelection,
    isPending,
  };
};
