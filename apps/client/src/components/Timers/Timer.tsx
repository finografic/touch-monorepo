import React, { useCallback, useEffect, useState } from 'react';

import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useTimers } from 'providers/TimersProvider';

import { formatTime } from 'utils/time.utils';

import { getElapsedTimeAndEventNumberSec, playCompleteSound, playTickSound } from './shared/timer.utils';
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
  const { mainPageSelectedSlots, setMainPageSelectedSlots } = useLayoutUi();
  const [remainingTime, setRemainingTime] = useState<number>(0);

  // Use shared event handling hook
  const { handleTickEvent, handleCompleteEvent } = useTimerEvents({
    onTick: ({ elapsed, remaining, eventNumber }) => {
      // Play tick sound when event fires
      if (eventNumber > 0) {
        playTickSound().catch(() => {});
      }
    },
    onComplete: ({ elapsed, remaining, orderId }) => {
      console.log('timer: COMPLETED.', { elapsed, remaining, orderId });
      playCompleteSound().catch(() => {});
    },
  });

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

      // Handle tick events using shared hook
      const { elapsed, eventNumber } = getElapsedTimeAndEventNumberSec(timer.duration, remaining);
      handleTickEvent(eventNumber, { elapsed, remaining, orderId: timer.orderId, eventNumber });

      // Check if timer completed
      if (remaining <= 0) {
        handleCompleteEvent({ elapsed, remaining, orderId: timer.orderId });
        handleComplete();
      }
    });

    return cleanup;
  }, [timer, slotNumber, updateTimer, handleComplete, handleTickEvent, handleCompleteEvent]);

  // If no timer or timer is not processing, show empty
  if (status !== 'processing') {
    return <span>00:00</span>;
  }

  return <span>{formatTime(remainingTime)}</span>;
};
