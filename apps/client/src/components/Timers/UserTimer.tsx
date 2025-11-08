import React, { useCallback, useEffect, useState } from 'react';

import { useTimers } from 'providers/TimersProvider';

import { formatTime, formatTimeFromMs } from 'utils/time.utils';
import { parseCompletionTime } from './shared/timer.utils';
import { timerManager } from './shared/TimerManager';
import { TimerResetIcon } from 'styles/icons/icons';
import { styles } from './UserTimer.styles';

interface UserTimerProps {
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
export const UserTimer: React.FC<UserTimerProps> = ({ slotNumber, onComplete }) => {
  const store = useTimers();
  const maintenanceTimer = store.getMaintenanceTimerBySlot(slotNumber);
  const { startMaintenanceTimer, stopMaintenanceTimer } = store;
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const handleComplete = useCallback(() => {
    timerManager.stopTimer(slotNumber);
    // For maintenance, mark as idle
    stopMaintenanceTimer(slotNumber);
    onComplete?.();
  }, [slotNumber, stopMaintenanceTimer, onComplete]);

  useEffect(
    function initializeTimerInstance() {
      const cleanup = () => {
        timerManager.stopTimer(slotNumber);
      };

      // If no timer or timer is not processing, reset state
      if (!maintenanceTimer || maintenanceTimer.status !== 'processing') {
        setRemainingTime(0);
        cleanup();
        return cleanup;
      }

      const { remaining } = parseCompletionTime(maintenanceTimer);
      setRemainingTime(remaining);

      // If already expired, complete immediately
      if (remaining <= 0) {
        handleComplete();
        return cleanup;
      }

      // Start timer interval, loop callback
      timerManager.startTimer(slotNumber, () => {
        const { remaining } = parseCompletionTime(maintenanceTimer);
        setRemainingTime(remaining);

        if (remaining <= 0) {
          handleComplete();
        }
      });

      return cleanup;
    },
    [maintenanceTimer, slotNumber, handleComplete],
  );

  // if (!maintenanceTimer || maintenanceTimer.status !== 'processing') {
  //   return <span>00:00</span>;
  // }

  // return <span>{formatTime(remainingTime)}</span>;

  return (
    <div css={styles}>
      <div className="user-timer">
        <span>
          {/* {process.env.NODE_ENV === 'development' && <TimerResetIcon />} */}
          {/* <strong>{formatTimeFromMs(remainingTime)}</strong> */}
          {maintenanceTimer && maintenanceTimer.status === 'processing' ? (
            <strong>{formatTime(remainingTime)}</strong>
          ) : (
            <span>00:00</span>
          )}
        </span>
      </div>
    </div>
  );
};
