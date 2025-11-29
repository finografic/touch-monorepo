import React, { useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';
import { parseCompletionTime } from 'components/Timers/shared/timer.utils';
import { timerManager } from 'components/Timers/shared/TimerManager';
import { useTimerEvents } from 'components/Timers/shared/useTimerEvents';

import { useTimers } from 'providers/TimersProvider/TimersContext';

import { formatTime } from 'utils/time.utils';
import { styles } from './AdminSlotTimer.styles';

interface AdminSlotTimerProps {
  slotNumber: number;
  onComplete?: () => void;
}

/**
 * Admin Slot Timer Component
 *
 * Displays timer countdown for a specific slot using the regular timers from TimersContext.
 * Unlike UserTimer which uses maintenance timers, this uses the main timers array.
 *
 * Features:
 * - Uses getTimerBySlotNumber to find timers
 * - Displays countdown for processing timers
 * - Automatic cleanup
 * - Type-safe props
 */
export const AdminSlotTimer: React.FC<AdminSlotTimerProps> = ({ slotNumber, onComplete }) => {
  const { timer, updateTimer, snooze, setSnooze } = useTimers({ slotNumber });
  const [remainingTime, setRemainingTime] = useState<number>(0);

  if (!timer) {
    return null;
  }

  const { handleCompleteEvent } = useTimerEvents({
    onComplete: () => {
      // TODO: handle snooze logic ??
      if (!snooze) {
        setSnooze(true);
      }
    },
  });

  const handleComplete = useCallback(() => {
    timerManager.stopTimer(slotNumber);

    if (timer) {
      updateTimer(timer.id, { status: 'completed' });
    }

    // Call external completion handler
    onComplete?.();
  }, [slotNumber, timer, updateTimer, onComplete]);

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

        if (remaining <= 0) {
          handleCompleteEvent({ remaining, orderId: timer.orderId });
          handleComplete();
        }
      });

      return cleanup;
    },
    [timer, slotNumber, updateTimer, handleComplete, handleCompleteEvent],
  );

  return (
    <div css={styles}>
      <div className={clsx('admin-slot-timer', `status-${timer.status}`)}>
        <span>{timer.status === 'completed' ? '00:00' : formatTime(remainingTime)}</span>
      </div>
    </div>
  );
};
