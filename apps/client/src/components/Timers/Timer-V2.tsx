import React, { useCallback, useEffect, useState } from 'react';

import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useTimers } from 'providers/TimersProvider';

import { formatTime } from 'utils/time.utils';

import {
  getElapsedTimeAndEventNumberMs,
  getElapsedTimeAndEventNumberSec,
  parseCompletionTime,
  playCompleteSound,
  playTickSound,
} from './shared/timer.utils';
import { timerManager } from './shared/TimerManager';
import { useTimerEvents } from './shared/useTimerEvents';

interface TimerProps {
  slotNumber: number;
  onComplete?: () => void;
}

/**
 * Timer Component - Pure UI Component
 *
 * Displays timer countdown for a specific slot.
 * All timer logic is handled by the useTimerLogic hook.
 *
 * Features:
 * - Clean separation of concerns
 * - Pure UI component
 * - Automatic cleanup
 * - Type-safe props
 */
export const Timer: React.FC<TimerProps> = ({ slotNumber, onComplete }) => {
  const { timers, updateTimer } = useTimers();
  const { selectedSlots, setSelectedSlots } = useLayoutUi();
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const { handleTickEvent, handleCompleteEvent } = useTimerEvents({
    onTick: ({ remaining, eventNumber }) => {
      // NEW: No Timer Events are fired.
      if (eventNumber > 0) {
        // log('timer: COMPLETED.', 'red', { remaining, eventNumber });
        // playTickSound().catch(() => {});
      }
    },
    onComplete: ({ remaining, orderId }) => {
      console.log('timer: COMPLETED.', { remaining, orderId });
      playCompleteSound().catch(() => {});
    },
  });

  // Find timer for this slot
  const timer = timers.find((t) => t.slotNumber === slotNumber);
  const status = timer?.status || 'idle';
  // const isActive = status === 'processing';

  const handleComplete = useCallback(() => {
    timerManager.stopTimer(slotNumber);

    if (timer) {
      updateTimer(timer.id, { status: 'completed' });
    }

    // Remove from selected slots if present
    const isTimerSelected = selectedSlots.find((slot) => slot.slotNumber === slotNumber);
    if (isTimerSelected) {
      const updatedSlots = selectedSlots.filter((slot) => slot.slotNumber !== slotNumber);
      console.log('TIMER_COMPLETE:', timer);
      setSelectedSlots(updatedSlots);
    }

    // Call external completion handler
    onComplete?.();
  }, [slotNumber, timer, updateTimer, selectedSlots, setSelectedSlots, onComplete]);

  useEffect(
    function initializeTimerInstance() {
      const cleanup = () => {
        timerManager.stopTimer(slotNumber);
      };

      // If no timer or timer is not processing, reset state
      if (!timer || timer.status !== 'processing') {
        setRemainingTime(0);
        cleanup();
        return cleanup;
      }

      const { remaining } = parseCompletionTime(timer);
      setRemainingTime(remaining);

      // If already expired, complete immediately
      if (remaining <= 0) {
        handleComplete();
        return cleanup;
      }

      // Start timer interval, loop callback
      timerManager.startTimer(slotNumber, () => {
        const { remaining } = parseCompletionTime(timer);
        setRemainingTime(remaining);

        // NEW: No Timer Events are fired.
        // const { eventNumber } = getElapsedTimeAndEventNumberSec(timer.duration, remaining);
        // handleTickEvent({ remaining, eventNumber, orderId: timer.orderId });

        if (remaining <= 0) {
          handleCompleteEvent({ remaining, orderId: timer.orderId });
          handleComplete();
        }
      });

      return cleanup;
    },
    [timer, slotNumber, updateTimer, handleComplete, handleTickEvent, handleCompleteEvent],
  );

  if (status !== 'processing') {
    return <span>00:00</span>;
  }

  return <span>{formatTime(remainingTime)}</span>;
};
