import { useCallback, useMemo } from 'react';

import createCuid from '@bugsnag/cuid';

import { useRecallConfig } from 'hooks/useRecallConfig';
import { useSlotItemsConfig } from 'hooks/useSlotItemsConfig';
import { useFiltersContext } from 'providers/FiltersProvider';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { type TimerItem, useTimers } from 'providers/TimersProvider';

import { stopAllAudio } from 'utils/soundCache.utils';
import { FLOW_TYPES } from 'types/flow.types';

export const useMainPageOperations = () => {
  const { addTimer, timers, removeTimer, updateTimers, setSnooze } = useTimers();
  const { toggleMainPageSlot, selectedSlots, setSelectedSlots } = useLayoutUi();
  const { loadRecallConfig, isRecallExpired, recallConfig } = useRecallConfig();
  const { setFilter } = useFiltersContext();

  // Get slot config data
  const {
    items: slotItems, // SlotItem[]
    itemsBySlot: slotItemsBySlot, // Map<number, SlotItem>
  } = useSlotItemsConfig();

  // Precompute timer lookup structures
  const { timerSlots, timersBySlot, activeTimers } = useMemo(() => {
    const bySlot = new Map<number, TimerItem>();
    const active: TimerItem[] = [];
    const slots = new Set<number>();

    for (const t of timers) {
      bySlot.set(t.slotNumber, t);
      slots.add(t.slotNumber);
      if (t.status !== 'completed') active.push(t);
    }

    return {
      timerSlots: slots,
      timersBySlot: bySlot,
      activeTimers: active,
    };
  }, [timers]);

  // Derived active slots from slot config data
  const activeSlots = useMemo(() => slotItems.filter((s) => s.isActive), [slotItems]);

  // ========================================================================
  // TIMER OPERATIONS
  // ========================================================================

  const handleCancelSelected = useCallback(() => {
    for (const slot of selectedSlots) {
      const timer = timersBySlot.get(slot.slotNumber);
      if (timer?.status === 'processing' || timer?.status === 'completed') {
        removeTimer(timer.id);
        toggleMainPageSlot(slot);
      }
    }
  }, [timersBySlot, selectedSlots, removeTimer, toggleMainPageSlot]);

  const handleResetCompleted = useCallback(() => {
    stopAllAudio();
    setSnooze(false);
    updateTimers(activeTimers);
  }, [activeTimers, updateTimers, setSnooze]);

  // ========================================================================
  // SELECTION OPERATIONS
  // ========================================================================

  const handleSelectAll = useCallback(() => {
    // slots that cannot be selected:
    // - slots that already have timers running
    // - slots that are already selected
    const ignores = new Set<number>([...timerSlots, ...selectedSlots.map((slot) => slot.slotNumber)]);

    for (const slot of activeSlots) {
      if (!ignores.has(slot.slotNumber)) {
        toggleMainPageSlot({ ...slot, isChecked: true, status: 'idle' });
      }
    }
  }, [activeSlots, timerSlots, selectedSlots, toggleMainPageSlot]);

  // ========================================================================
  // REPEAT CONFIGURATION
  // ========================================================================

  const handleRepeatSelection = useCallback(() => {
    if (!recallConfig || isRecallExpired) return;
    const config = loadRecallConfig();
    if (!config) return;

    if (config.filters) {
      for (const [key, value] of Object.entries(config.filters)) {
        if (value != null) setFilter(key as any, value);
      }
    }

    const ignores = timerSlots;

    for (const slot of selectedSlots) {
      if (ignores.has(slot.slotNumber)) continue;

      const orderConfig = slotItemsBySlot.get(slot.slotNumber);
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
  }, [
    selectedSlots,
    slotItemsBySlot,
    addTimer,
    setSelectedSlots,
    loadRecallConfig,
    setFilter,
    recallConfig,
    isRecallExpired,
    timerSlots,
  ]);

  return {
    handleResetCompleted,
    handleCancelSelected,
    handleSelectAll,
    handleRepeatSelection,
    isPending: false,
  };
};
