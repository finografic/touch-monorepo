import { useEffect, useRef, useState } from 'react';

import { useTimersOptional } from 'providers/TimersProvider';

import { formatTimeFromMs } from 'utils/time.utils';

import { POLLING_INTERVAL_MS, SNOOZE_INTERVAL_MS } from 'config/app';
import { TimerResetIcon } from 'styles/icons/icons';
import { styles } from './SnoozeTimer.styles';

interface SnoozeTimerProps {
  /**
   * When true, new timer completions will RESTART the snooze countdown.
   * When false, snooze timer continues its current cycle uninterrupted.
   * @default false
   */
  shouldDebounce?: boolean;
}

/**
 * SnoozeTimer - A repeating countdown timer that runs while completed timers exist
 *
 * Behavior:
 * 1. Starts when ANY timer completes (status === 'completed')
 * 2. Counts down from SNOOZE_INTERVAL_MS
 * 3. Automatically resets and repeats when it reaches 0
 * 4. Only runs while timers.some(t => t.status === 'completed') is true
 * 5. Stops when all completed timers are cleared
 * 6. (Optional) Debounce mode: Restarts countdown when new timers complete
 */
export const SnoozeTimer = ({ shouldDebounce = false }: SnoozeTimerProps) => {
  const timersContext = useTimersOptional();
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [snoozeStartTime, setSnoozeStartTime] = useState<number | null>(null);

  // Track completed timer count for debouncing
  const previousCompletedCountRef = useRef<number>(0);

  // Get completed timers count
  const hasCompletedTimers = timersContext?.timers.some((t) => t.status === 'completed') ?? false;
  const completedCount = timersContext?.timers.filter((t) => t.status === 'completed').length ?? 0;

  useEffect(() => {
    // If no completed timers, reset snooze timer
    if (!hasCompletedTimers) {
      setSnoozeStartTime(null);
      setRemainingTime(0);
      previousCompletedCountRef.current = 0;
      return;
    }

    // DEBOUNCE LOGIC: If shouldDebounce is true and a new timer just completed, restart the snooze
    if (shouldDebounce && snoozeStartTime !== null && completedCount > previousCompletedCountRef.current) {
      console.log('🔄 SnoozeTimer: New timer completed, restarting snooze countdown');
      setSnoozeStartTime(Date.now()); // Restart the countdown
    }

    // Update the previous completed count
    previousCompletedCountRef.current = completedCount;

    // If we have completed timers but no snooze start time, start the snooze timer
    if (!snoozeStartTime) {
      setSnoozeStartTime(Date.now());
    }

    const updateRemainingTime = () => {
      if (!snoozeStartTime) return;

      const now = Date.now();
      const elapsed = now - snoozeStartTime;
      const remaining = SNOOZE_INTERVAL_MS - (elapsed % SNOOZE_INTERVAL_MS);

      setRemainingTime(remaining);

      // When timer reaches 0, it will automatically restart due to modulo operation
      // The % operator creates a repeating cycle
    };

    // Initial calculation
    updateRemainingTime();

    // Update every POLLING_INTERVAL_MS
    const intervalId = setInterval(updateRemainingTime, POLLING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [hasCompletedTimers, snoozeStartTime, shouldDebounce, completedCount]);

  // Don't render if there are no completed timers
  if (!hasCompletedTimers || remainingTime <= 0) {
    return null;
  }

  return (
    <div css={styles}>
      <div className="snooze-timer">
        <span>
          <TimerResetIcon />
          <strong>{formatTimeFromMs(remainingTime)}</strong>
        </span>
      </div>
    </div>
  );
};
