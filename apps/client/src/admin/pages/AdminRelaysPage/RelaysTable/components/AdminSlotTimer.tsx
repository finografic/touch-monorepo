import React, { useCallback, useEffect, useState } from 'react';

import { DEFROST_SLOT_NUMBER } from 'admin/config/admin.slots.config';
import clsx from 'clsx';
import { parseCompletionTime } from 'components/Timers/shared/timer.utils';
import { timerSubscriptionRegistry } from 'components/Timers/shared/TimerSubscriptionRegistry';
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
 * Displays timer countdown for a specific slot.
 * - For regular slots: Uses the regular timers from TimersContext.timers array
 * - For defrost slot (slot 15): Uses the defrost timer from TimersContext.defrost
 *
 * Features:
 * - Uses getTimerBySlotNumber to find regular timers
 * - Uses defrost timer for slot 15
 * - Displays countdown for processing timers
 * - Automatic cleanup
 * - Type-safe props
 */
export const AdminSlotTimer: React.FC<AdminSlotTimerProps> = ({ slotNumber, onComplete }) => {
  const { timer, defrost, updateTimer, snooze, setSnooze } = useTimers({ slotNumber });
  const [remainingTime, setRemainingTime] = useState<number>(0);

  // For defrost slot, use defrost timer instead of regular timer
  const activeTimer = slotNumber === DEFROST_SLOT_NUMBER ? defrost : timer;

  if (!activeTimer) {
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
    timerSubscriptionRegistry.unregister(slotNumber);

    // Only update regular timers (defrost timer is handled separately)
    if (timer && slotNumber !== DEFROST_SLOT_NUMBER) {
      updateTimer(timer.id, { status: 'completed' });
    }

    // Call external completion handler
    onComplete?.();
  }, [slotNumber, timer, updateTimer, onComplete]);

  useEffect(
    function initializeTimerInstance() {
      const cleanup = () => {
        timerSubscriptionRegistry.unregister(slotNumber);
      };

      // If no timer or timer is not processing, reset state
      if (!activeTimer || activeTimer.status !== 'processing') {
        setRemainingTime(0);
        cleanup();
        return cleanup;
      }

      const { remaining } = parseCompletionTime(activeTimer);
      setRemainingTime(remaining);

      // If already expired, complete immediately
      if (remaining <= 0) {
        handleComplete();
        return cleanup;
      }

      // Register callback with timer subscription registry (subscribes to heartbeat service)
      timerSubscriptionRegistry.register(slotNumber, () => {
        const { remaining } = parseCompletionTime(activeTimer);
        setRemainingTime(remaining);

        if (remaining <= 0) {
          // Only call handleCompleteEvent for regular timers (has orderId)
          if (slotNumber !== DEFROST_SLOT_NUMBER && timer && 'orderId' in timer) {
            handleCompleteEvent({ remaining, orderId: timer.orderId });
          }
          handleComplete();
        }
      });

      return cleanup;
    },
    [activeTimer, slotNumber, updateTimer, handleComplete, handleCompleteEvent],
  );

  return (
    <div css={styles}>
      <div className={clsx('admin-slot-timer', `status-${activeTimer.status}`)}>
        <span>{activeTimer.status === 'completed' ? '00:00' : formatTime(remainingTime)}</span>
      </div>
    </div>
  );
};
