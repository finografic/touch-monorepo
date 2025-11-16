import React, { useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';
import { parseCompletionTime } from 'components/Timers/shared/timer.utils';
import { timerManager } from 'components/Timers/shared/TimerManager';

import { useTimers } from 'providers/TimersProvider';

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
  const store = useTimers();
  const timer = store.getTimerBySlotNumber(slotNumber);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  // Don't render if timer is not in the timers[] array
  if (!timer) {
    return null;
  }

  const handleComplete = useCallback(() => {
    timerManager.stopTimer(slotNumber);
    onComplete?.();
  }, [slotNumber, onComplete]);

  // Reset remainingTime when status changes to completed
  useEffect(() => {
    if (timer.status === 'completed') {
      setRemainingTime(0);
      timerManager.stopTimer(slotNumber);
    }
  }, [timer.status, slotNumber]);

  useEffect(
    function initializeTimerInstance() {
      const cleanup = () => {
        timerManager.stopTimer(slotNumber);
      };

      // If timer is not processing, reset state and cleanup
      if (timer.status !== 'processing') {
        setRemainingTime(0);
        cleanup();
        return cleanup;
      }

      // Calculate remaining time from completionTime
      if (!timer.completionTime) {
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
        // Get current timer from store to check latest status
        const currentTimer = store.getTimerBySlotNumber(slotNumber);

        // Stop updating if timer no longer exists or is not processing
        if (!currentTimer || currentTimer.status !== 'processing') {
          setRemainingTime(0);
          timerManager.stopTimer(slotNumber);
          return;
        }

        // Recalculate remaining time from current timer's completionTime
        const { remaining: currentRemaining } = parseCompletionTime(currentTimer);
        setRemainingTime(currentRemaining);

        if (currentRemaining <= 0) {
          handleComplete();
        }
      });

      return cleanup;
    },
    [timer, slotNumber, handleComplete],
  );

  // Get status class for styling
  const statusClass = timer ? `status-${timer.status}` : 'status-none';

  // Force "00:00" when status is "completed" (for both program-time and program-product)
  // Only show countdown when status is "processing"
  const isCompleted = timer.status === 'completed';
  const isProcessing = timer.status === 'processing';
  const displayTime = isCompleted ? '00:00' : formatTime(remainingTime);

  return (
    <div css={styles}>
      <div className={clsx('admin-slot-timer', statusClass)}>
        <span>{isProcessing ? <span>{displayTime}</span> : <span>00:00</span>}</span>
      </div>
    </div>
  );
};
