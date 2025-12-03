import { useCallback, useMemo, useTransition } from 'react';

import createCuid from '@bugsnag/cuid';

import { useRecallConfig } from 'hooks/useRecallConfig';
import { useSlotItemsConfig } from 'hooks/useSlotItemsConfig';
import { useFiltersContext } from 'providers/FiltersProvider';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useTimers, type TimerItem } from 'providers/TimersProvider';

import { stopAllAudio } from 'utils/soundCache.utils';
import { FLOW_TYPES } from 'types/flow.types';
import { useGetSlotConfigurations } from 'queries/slot-configurations';
import type { SlotItem } from 'types/slot-config.types';

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
  const { updateTimers, setSnooze } = useTimers();
  const orderItemsConfig = useSlotItemsConfig();
  const slotsConfigQuery = useGetSlotConfigurations();
  const { setFilter } = useFiltersContext();

  const slotsConfig = slotsConfigQuery.isSuccess ? slotsConfigQuery.data : [];

  const { timerSlots, timersBySlot, activeTimers, configBySlot } = useMemo(() => {
    const bySlot = new Map<number, TimerItem>();
    const active: TimerItem[] = [];
    const slots = new Set<number>();
    const configMap = new Map<number, SlotItem>();

    for (const o of orderItemsConfig) {
      configMap.set(o.slotNumber, o);
    }

    for (const t of timers) {
      bySlot.set(t.slotNumber, t);
      slots.add(t.slotNumber);
      if (t.status !== 'completed') active.push(t);
    }

    return {
      timerSlots: slots,
      timersBySlot: bySlot,
      activeTimers: active,
      configBySlot: configMap,
    };
  }, [timers, orderItemsConfig]);

  const activeSlots = useMemo(() => {
    if (slotsConfigQuery.isLoading || slotsConfigQuery.isError) return [];

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
      setSnooze(false);
      updateTimers(activeTimers);
    });
  }, [activeTimers, updateTimers, setSnooze]);

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

      const ignores = new Set(timerSlots);

      for (const slot of selectedSlots) {
        if (ignores.has(slot.slotNumber)) continue;

        const orderConfig = configBySlot.get(slot.slotNumber);
        if (!orderConfig) continue;

        const duration = config.durations?.[orderConfig.slotType] ?? config.durations?.default;
        if (duration == null) continue;

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

      setSelectedSlots([]);
    });
  }, [
    selectedSlots,
    configBySlot,
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
