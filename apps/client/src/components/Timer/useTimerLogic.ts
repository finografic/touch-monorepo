import { useEffect, useRef, useState, useCallback } from 'react';
import { useTimers } from 'providers/TimersProvider';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { timerManager } from './TimerManager';
import { completeAction, getElapsedTimeAndEventNumber, tickAction } from './timers.utils';

/**
 * Custom hook for timer logic
 *
 * Encapsulates all timer-related logic including:
 * - Timer state management
 * - Interval handling
 * - Event callbacks
 * - Layout UI updates
 *
 * Returns timer state and actions for UI components to consume.
 */
export interface UseTimerLogicReturn {
  remainingTime: number;
  status: 'idle' | 'processing' | 'completed';
  isActive: boolean;
  handleComplete: () => void;
}

export const useTimerLogic = (slotNumber: number, onComplete?: () => void): UseTimerLogicReturn => {
  const { timers, updateTimer } = useTimers();
  const { mainPageSelectedSlots, setMainPageSelectedSlots } = useLayoutUi();
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const lastEventFiredRef = useRef<number>(-1);

  // Find timer for this slot
  const timer = timers.find((t) => t.slotNumber === slotNumber);
  const status = timer?.status || 'idle';
  const isActive = status === 'processing';

  const handleComplete = useCallback(() => {
    console.debug('Timer: completing', { slotNumber });

    // Stop timer interval
    timerManager.stopTimer(slotNumber);

    // Update timer state
    if (timer) {
      updateTimer(timer.id, {
        status: 'completed',
        remaining: 0,
        completedAt: new Date().toISOString(),
      });
    }

    // Remove from selected slots if present
    const isTimerSelected = mainPageSelectedSlots.find((slot) => slot.slotNumber === slotNumber);
    if (isTimerSelected) {
      const updatedSlots = mainPageSelectedSlots.filter((slot) => slot.slotNumber !== slotNumber);
      console.log('TIMER_COMPLETE:', timer);
      setMainPageSelectedSlots(updatedSlots);
    }

    // Call external completion handler
    onComplete?.();
  }, [slotNumber, timer, updateTimer, mainPageSelectedSlots, setMainPageSelectedSlots, onComplete]);

  useEffect(() => {
    // Cleanup function
    const cleanup = () => {
      timerManager.stopTimer(slotNumber);
    };

    // If no timer or timer is not processing, reset state
    if (!timer || timer.status !== 'processing') {
      setRemainingTime(0);
      cleanup();
      return cleanup;
    }

    const endTime = new Date(timer.estimatedCompletionTime!).getTime();
    const startTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000);

    // Set initial remaining time
    setRemainingTime(Math.max(0, duration));
    lastEventFiredRef.current = -1;

    // If already expired, complete immediately
    if (duration <= 0) {
      handleComplete();
      return cleanup;
    }

    // Start timer interval
    timerManager.startTimer(slotNumber, () => {
      const now = Date.now();
      const remaining = Math.floor((endTime - now) / 1000);

      setRemainingTime(Math.max(0, remaining));

      // Update timer in context
      if (timer) {
        updateTimer(timer.id, { remaining: Math.max(0, remaining) });
      }

      // Handle tick events
      const { elapsed, eventNumber } = getElapsedTimeAndEventNumber(timer.duration, remaining);
      if (eventNumber > lastEventFiredRef.current) {
        lastEventFiredRef.current = eventNumber;
        tickAction({ elapsed, remaining, orderId: timer.orderId, eventNumber });
      }

      // Check if timer completed
      if (remaining <= 0) {
        completeAction({ elapsed, remaining, orderId: timer.orderId });
        handleComplete();
      }
    });

    return cleanup;
  }, [timer, slotNumber, updateTimer, handleComplete]);

  return {
    remainingTime,
    status,
    isActive,
    handleComplete,
  };
};
