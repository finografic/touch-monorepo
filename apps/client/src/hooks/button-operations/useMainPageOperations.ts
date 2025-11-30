import { useCallback, useTransition } from 'react';

import createCuid from '@bugsnag/cuid';

import { useRecallConfig } from 'hooks/useRecallConfig';
import { useSlotItemsConfig } from 'hooks/useSlotItemsConfig';
import { useFiltersContext } from 'providers/FiltersProvider';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useOrders } from 'providers/OrdersProvider';
import { useTimers } from 'providers/TimersProvider';

import { stopAllAudio } from 'utils/soundCache.utils';
import { FLOW_TYPES } from 'types/flow.types';
import { useGetSlotConfigurations } from 'queries/slot-configurations';

/**
 * Handles MainPage-specific operations:
 * - Timer management (clear/cancel completed)
 * - Selection operations (select all)
 * - Repeat last configuration
 */
export const useMainPageOperations = () => {
  const [isPending, startTransition] = useTransition();
  const { orders } = useOrders();
  const { addTimer, resetCompletedTimers, timers, removeTimer } = useTimers();
  const { clearMainPageSelection, toggleMainPageSlot, selectedSlots, setSelectedSlots } = useLayoutUi();
  const { saveRecallConfig, loadRecallConfig } = useRecallConfig();
  const { isRecallExpired, recall } = useTimers();
  const orderItemsConfig = useSlotItemsConfig();
  const slotsConfigQuery = useGetSlotConfigurations();
  const { setFilter } = useFiltersContext();

  const timerSlots = timers.map((timer) => timer.slotNumber);
  const activeSlots = slotsConfigQuery.data.filter((slot) => slot.isActive);

  // ========================================================================
  // TIMER OPERATIONS
  // ========================================================================

  const handleCancelSelected = useCallback(() => {
    startTransition(() => {
      log('1. handleCancelSelected', 'magenta', { ID: 1 });
      // Clear only timers that are SELECTED/checked
      const selectedSlotsWithTimers = selectedSlots.filter((slot) => {
        const timer = timers.find((t) => t.slotNumber === slot.slotNumber);
        return timer && (timer.status === 'processing' || timer.status === 'completed');
      });

      // Remove timers for selected slots
      selectedSlotsWithTimers.forEach((slot) => {
        const timer = timers.find((t) => t.slotNumber === slot.slotNumber);
        if (timer) removeTimer(timer.id);
        toggleMainPageSlot(slot);
      });

      // Clear selection for slots that had timers
      // selectedSlotsWithTimers.forEach((slot) => {
      //   toggleMainPageSlot(slot);
      // });

      // TODO: CONFIRM IF OK TO REMOVE THIS (SHOULD BE!!)
      /*
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
      */
    });
  }, [selectedSlots, timers, removeTimer, toggleMainPageSlot, orders, saveRecallConfig]);

  const handleResetCompleted = useCallback(() => {
    startTransition(() => {
      log('1. handleResetCompleted', 'magenta', { ID: 2 });
      stopAllAudio();
      resetCompletedTimers();

      // TODO: CONFIRM IF OK TO REMOVE THIS (SHOULD BE!!)
      /*
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
      */
    });
  }, [resetCompletedTimers, orders, saveRecallConfig, selectedSlots]);
  // ========================================================================
  // SELECTION OPERATIONS
  // ========================================================================

  const handleSelectAll = useCallback(() => {
    const ignores = [...timerSlots, ...selectedSlots.map((slot) => slot.slotNumber)];

    startTransition(() => {
      for (const slot of activeSlots) {
        if (!ignores.includes(slot.slotNumber)) {
          toggleMainPageSlot({ ...slot, isChecked: true, status: 'idle' });
        }
      }
    });
  }, [selectedSlots]);

  // ========================================================================
  // REPEAT CONFIGURATION
  // ========================================================================

  const handleRepeatSelection = useCallback(() => {
    // Check if recall config is active (exists and not expired)
    log('4. handleRepeatSelection', 'magenta', { ID: 4 });
    if (!recall.config || isRecallExpired()) {
      console.error('No active recall config found');
      return;
    }

    // Load saved configuration using the hook
    const config = loadRecallConfig();
    if (!config) {
      console.error('No saved configuration found');
      return;
    }

    startTransition(() => {
      // Apply stored filters to FiltersContext
      if (config.filters && typeof config.filters === 'object') {
        const savedFilters = config.filters as Record<string, unknown>;

        // Apply each filter from the saved configuration
        Object.entries(savedFilters).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            setFilter(key as any, value);
          }
        });

        console.log('🎯 REPEAT: Applied stored filters to FiltersContext:', savedFilters);
      }

      // Apply configuration to all selected orders
      selectedSlots.forEach((slot) => {
        const orderConfig = orderItemsConfig.find((cfg) => cfg.slotNumber === slot.slotNumber);

        if (orderConfig) {
          // Get duration for this specific item type from saved config
          const slotTypeDuration = config.durations?.[orderConfig.slotType];
          const defaultDuration = config.durations?.default;
          // Use nullish coalescing (??) instead of || to allow 0 values
          const duration = slotTypeDuration ?? defaultDuration ?? 300;

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
  }, [
    selectedSlots,
    addTimer,
    orderItemsConfig,
    setSelectedSlots,
    loadRecallConfig,
    setFilter,
    recall,
    isRecallExpired,
  ]);

  return {
    handleResetCompleted,
    handleCancelSelected,
    handleSelectAll,
    handleRepeatSelection,
    isPending,
  };
};
