import { useEffect, useRef, useState } from 'react';

import { useTimers } from 'providers/TimersProvider';

import { playAlarmSound } from 'utils/sound.utils';
import { formatTimeDuration } from 'utils/time.utils';
import { SNOOZE_INTERVAL_MS } from 'config/app';
import { getCycleNumber, parseElapsedTime } from './shared/timer.utils';
import { useHeartbeatSubscription } from './shared/useHeartbeatSubscription';
import { TimerResetIcon } from '@finografic/icons';
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
  const timersContext = useTimers();
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const heartbeatNow = useHeartbeatSubscription(); // Subscribe to global heartbeat

  const previousCompletedCountRef = useRef<number>(0);
  const lastCycleRef = useRef<number>(0);
  const lastBeepTimeRef = useRef<number>(0);

  const hasCompletedTimers = timersContext.timers.some((t) => t.status === 'completed');
  const completedCount = timersContext.timers.filter((t) => t.status === 'completed').length;

  useEffect(() => {
    const shouldRun = hasCompletedTimers;

    if (!shouldRun) {
      setStartTime(null);
      setRemainingTime(0);
      previousCompletedCountRef.current = 0;
      lastBeepTimeRef.current = 0;
      return;
    }

    // DEBOUNCE LOGIC: If shouldDebounce is true and a new timer just completed, restart the snooze
    if (shouldDebounce && startTime !== null && completedCount > previousCompletedCountRef.current) {
      setStartTime(Date.now());
      lastCycleRef.current = 0;
    }
    previousCompletedCountRef.current = completedCount;

    // If we have completed timers but no snooze start time, start the snooze timer
    if (!startTime) {
      const currentTime = Date.now();
      setStartTime(currentTime);
      lastCycleRef.current = 0;
      lastBeepTimeRef.current = currentTime; // Initialize beep timer
    }
  }, [hasCompletedTimers, startTime, shouldDebounce, completedCount]);

  useEffect(
    function updateRemainingTime() {
      if (!startTime) return;

      const { remaining, totalElapsed } = parseElapsedTime({ startTime, now: heartbeatNow });
      setRemainingTime(remaining);

      // ALARM every 2 minutes (SNOOZE_INTERVAL_MS)
      // Check if 2 minutes have passed since last beep
      const timeSinceLastBeep = heartbeatNow - lastBeepTimeRef.current;

      if (timeSinceLastBeep >= SNOOZE_INTERVAL_MS) {
        const currentCycle = getCycleNumber(totalElapsed, SNOOZE_INTERVAL_MS);
        lastBeepTimeRef.current = heartbeatNow;
        lastCycleRef.current = currentCycle;
        playAlarmSound().catch(() => {});
      }
    },
    [heartbeatNow, startTime],
  );

  // Don't render if there are no completed timers or remaining time is 0
  const shouldRender = hasCompletedTimers && remainingTime > 0;
  if (!shouldRender) {
    return null;
  }

  return null;

  // NOTE: DEVELOPMENT ONLY - passive component, no UI required
  return (
    <div css={styles}>
      <div className="snooze-timer">
        <span>
          {process.env.NODE_ENV === 'development' && <TimerResetIcon />}
          <strong>{formatTimeDuration({ ms: remainingTime })}</strong>
        </span>
      </div>
    </div>
  );
};
