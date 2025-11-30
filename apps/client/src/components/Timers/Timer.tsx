import React, { useCallback, useEffect, useState } from 'react';

import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useTimers } from 'providers/TimersProvider';

import { playAlarmSound, playCompleteSound } from 'utils/sound.utils';
import { formatTime } from 'utils/time.utils';
import { parseCompletionTime } from './shared/timer.utils';
import { timerSubscriptionRegistry } from './shared/TimerSubscriptionRegistry';
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
  const { timer, updateTimer, snooze, setSnooze } = useTimers({ slotNumber });
  const { selectedSlots, setSelectedSlots } = useLayoutUi();
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const { handleCompleteEvent } = useTimerEvents({
    onComplete: ({ remaining, orderId }) => {
      log('timer: COMPLETED.', 'cyan', { snooze, remaining, orderId });
      if (snooze) {
        playCompleteSound().catch(() => {
          log('timer: COMPLETED (DING)', 'yellow', { snooze, remaining, orderId });
        });
        // playAlarmSound().catch(() => {
        //   log('timer: COMPLETED (ALARM)', 'red', { snooze, remaining, orderId });
        // });
      } else {
        setSnooze(true);
        playCompleteSound().catch(() => {
          log('timer: COMPLETED (DING)', 'yellow', { snooze, remaining, orderId });
        });
      }
    },
  });

  const handleComplete = useCallback(() => {
    timerSubscriptionRegistry.unregister(slotNumber);

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
        timerSubscriptionRegistry.unregister(slotNumber);
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

      // Register callback with timer registry (subscribes to heartbeat)
      timerSubscriptionRegistry.register(slotNumber, () => {
        // Re-parse timer to get current remaining time
        const { remaining } = parseCompletionTime(timer);
        setRemainingTime(remaining);

        if (remaining <= 0) {
          handleCompleteEvent({ remaining, orderId: timer.orderId });
          handleComplete();
        }
      });

      return cleanup;
    },
    [timer, slotNumber, updateTimer, handleComplete, handleCompleteEvent],
  );

  if (timer.status !== 'processing') {
    return <span>00:00</span>;
  }

  return <span>{formatTime(remainingTime)}</span>;
};
