import React, { useCallback, useEffect, useState } from 'react';

import { useTimers } from 'providers/TimersProvider';

import { formatTime } from 'utils/time.utils';
import { parseCompletionTime } from './shared/timer.utils';
import { timerSubscriptionRegistry } from './shared/TimerSubscriptionRegistry';
import { styles } from './DefrostTimer.styles';

interface DefrostTimerProps {
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
export const DefrostTimer: React.FC<DefrostTimerProps> = ({ slotNumber, onComplete }) => {
  const { stopDefrostTimer, defrost } = useTimers();

  const [remainingTime, setRemainingTime] = useState<number>(0);

  const handleComplete = useCallback(() => {
    timerSubscriptionRegistry.unregister(slotNumber);
    // For maintenance, mark as idle
    stopDefrostTimer(slotNumber);
    onComplete?.();
  }, [slotNumber, stopDefrostTimer, onComplete]);

  useEffect(
    function initializeTimerInstance() {
      const cleanup = () => {
        timerSubscriptionRegistry.unregister(slotNumber);
      };

      // If no timer or timer is not processing, reset state
      if (!defrost || defrost.status !== 'processing') {
        setRemainingTime(0);
        cleanup();
        return cleanup;
      }

      const { remaining } = parseCompletionTime(defrost);
      setRemainingTime(remaining);

      // If already expired, complete immediately
      if (remaining <= 0) {
        handleComplete();
        return cleanup;
      }

      // Register callback with timer registry (subscribes to heartbeat)
      timerSubscriptionRegistry.register(slotNumber, () => {
        // Re-parse timer to get current remaining time
        const { remaining } = parseCompletionTime(defrost);
        setRemainingTime(remaining);

        if (remaining <= 0) {
          handleComplete();
        }
      });

      return cleanup;
    },
    [defrost, slotNumber, handleComplete],
  );

  // if (!maintenanceTimer || maintenanceTimer.status !== 'processing') {
  //   return <span>00:00</span>;
  // }

  // return <span>{formatTime(remainingTime)}</span>;

  return (
    <div css={styles}>
      <div className="defrost-timer">
        <span>
          {/* {process.env.NODE_ENV === 'development' && <TimerResetIcon />} */}
          {/* <strong>{formatTimeFromMs(remainingTime)}</strong> */}
          {defrost && defrost.status === 'processing' ? (
            <strong>{formatTime(remainingTime)}</strong>
          ) : (
            <span>00:00</span>
          )}
        </span>
      </div>
    </div>
  );
};
