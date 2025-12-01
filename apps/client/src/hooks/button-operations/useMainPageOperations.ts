import { useCallback, useMemo, useTransition } from 'react';

import createCuid from '@bugsnag/cuid';

import { useRecallConfig } from 'hooks/useRecallConfig';
import { useSlotItemsConfig } from 'hooks/useSlotItemsConfig';
import { useFiltersContext } from 'providers/FiltersProvider';
import { useLayoutUi } from 'providers/LayoutUiProvider';
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
  const { addTimer, timers, removeTimer } = useTimers();
  const { toggleMainPageSlot, selectedSlots, setSelectedSlots } = useLayoutUi();
  const { loadRecallConfig, isRecallExpired, recallConfig } = useRecallConfig();
  const { updateTimers } = useTimers();
  const orderItemsConfig = useSlotItemsConfig();
  const slotsConfigQuery = useGetSlotConfigurations();
  const { setFilter } = useFiltersContext();

  const timerSlots = useMemo(() => timers.map((timer) => timer.slotNumber), [timers]);
  const timersBySlot = useMemo(() => new Map(timers.map((t) => [t.slotNumber, t])), [timers]);
  const activeTimers = useMemo(() => timers.filter((timer) => timer.status !== 'completed'), [timers]);

  const activeSlots = useMemo(() => {
    if (slotsConfigQuery.isLoading || slotsConfigQuery.isError) return [];
    const slotsConfig = slotsConfigQuery?.data;

    return slotsConfig.filter((slot) => slot.isActive);
  }, [slotsConfigQuery.isLoading, slotsConfigQuery.isSuccess, slotsConfigQuery.data]);

  // ========================================================================
  // TIMER OPERATIONS
  // ========================================================================

  const handleCancelSelected = useCallback(() => {
    startTransition(() => {
      for (const slot of selectedSlots) {
        const timer = timersBySlot.get(slot.slotNumber);
        if (timer?.status === 'processing' || timer?.status === 'completed') {
          removeTimer(timer.id);
          toggleMainPageSlot(slot);
        }
      }
    });
  }, [timersBySlot, selectedSlots, removeTimer, toggleMainPageSlot]);

  const handleResetCompleted = useCallback(() => {
    startTransition(() => {
      stopAllAudio();
      updateTimers(activeTimers);
    });
  }, [activeTimers]);

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
  }, [activeSlots, selectedSlots, toggleMainPageSlot]);

  // ========================================================================
  // REPEAT CONFIGURATION
  // ========================================================================

  const handleRepeatSelection = useCallback(() => {
    if (!recallConfig || isRecallExpired) {
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
        const orderConfig = orderItemsConfig.find((o) => o.slotNumber === slot.slotNumber);

        if (orderConfig) {
          // Get duration for this specific item type from saved config
          const slotTypeDuration = config.durations?.[orderConfig.slotType];
          const defaultDuration = config.durations?.default;
          // Use nullish coalescing (??) instead of || to allow 0 values
          const duration = slotTypeDuration ?? defaultDuration;

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
      // uncheck slots
      setSelectedSlots([]);
    });
  }, [
    selectedSlots,
    addTimer,
    orderItemsConfig,
    setSelectedSlots,
    loadRecallConfig,
    setFilter,
    recallConfig,
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
