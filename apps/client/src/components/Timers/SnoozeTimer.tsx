import { useEffect, useRef, useState } from 'react';

import { useTimersOptional } from 'providers/TimersProvider';

import { playAlarmSound } from 'utils/sound.utils';
import { formatTimeFromMs } from 'utils/time.utils';
import { SNOOZE_INTERVAL_MS } from 'config/app';
import { getCycleNumber, parseElapsedTime } from './shared/timer.utils';
import { useTimerEvents } from './shared/useTimerEvents';
import { useHeartbeatSubscription } from './shared/useHeartbeatSubscription';
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
  // Check if recall config is active (exists and not expired)
  const hasActiveTimer = timersContext
    ? (() => {
        const now = Date.now();
        const isExpired = timersContext.recall.expiresAt === null || now >= timersContext.recall.expiresAt;
        return timersContext.recall.config !== null && !isExpired;
      })()
    : false;
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const now = useHeartbeatSubscription(); // Subscribe to global heartbeat

  // Track completed timer count for debouncing
  const previousCompletedCountRef = useRef<number>(0);

  // Track last cycle to detect when we've completed a full snooze cycle
  const lastCycleRef = useRef<number>(0);

  // Track last beep time to ensure we beep every 2 minutes
  const lastBeepTimeRef = useRef<number>(0);

  // Use shared event handling hook
  const { handleCompleteEvent } = useTimerEvents({
    onComplete: ({ elapsedMs, remainingMs, cycleNumber }) => {
      console.log('🔁 SnoozeTimer: REPEAT (cycle complete)', {
        elapsedMs,
        remainingMs,
        cycleNumber,
        elapsedSec: Math.floor((elapsedMs || 0) / 1000),
        remainingSec: Math.floor((remainingMs || 0) / 1000),
      });
      // Play completion sound when snooze cycle completes
      playAlarmSound().catch(() => {});
      // TODO: Add custom notification logic here
    },
  });

  // Get completed timers count
  const hasCompletedTimers = timersContext?.timers.some((t) => t.status === 'completed') ?? false;
  const completedCount = timersContext?.timers.filter((t) => t.status === 'completed').length ?? 0;

  // Setup/teardown logic for snooze timer
  useEffect(() => {
    // Only run if storage timer is active AND there are completed timers
    if (!hasActiveTimer || !hasCompletedTimers) {
      setStartTime(null);
      setRemainingTime(0);
      previousCompletedCountRef.current = 0;
      lastBeepTimeRef.current = 0;
      return;
    }

    // DEBOUNCE LOGIC: If shouldDebounce is true and a new timer just completed, restart the snooze
    if (shouldDebounce && startTime !== null && completedCount > previousCompletedCountRef.current) {
      console.log('🔄 SnoozeTimer: New timer completed, restarting snooze countdown');
      setStartTime(Date.now()); // Restart the countdown
      lastCycleRef.current = 0; // Reset cycle tracking
    }

    // Update the previous completed count
    previousCompletedCountRef.current = completedCount;

    // If we have completed timers but no snooze start time, start the snooze timer
    if (!startTime) {
      const currentTime = Date.now();
      setStartTime(currentTime);
      lastCycleRef.current = 0;
      lastBeepTimeRef.current = currentTime; // Initialize beep timer
      // Beep immediately when starting
      playAlarmSound().catch(() => {});
    }
  }, [hasActiveTimer, hasCompletedTimers, startTime, shouldDebounce, completedCount]);

  // Update remaining time when heartbeat ticks (now changes)
  useEffect(() => {
    if (!startTime) return;

    const { remaining, totalElapsed } = parseElapsedTime({ startTime, now });

    setRemainingTime(remaining);

    // Calculate which cycle we're in
    const currentCycle = getCycleNumber(totalElapsed, SNOOZE_INTERVAL_MS);

    // REPEAT ACTION: Fire when we complete a full cycle (remaining resets to SNOOZE_INTERVAL_MS)
    if (currentCycle > lastCycleRef.current) {
      lastCycleRef.current = currentCycle;
      handleCompleteEvent({
        elapsedMs: totalElapsed,
        remainingMs: remaining,
        cycleNumber: currentCycle,
      });
    }

    // BEEP every 2 minutes (SNOOZE_INTERVAL_MS)
    // Check if 2 minutes have passed since last beep
    const timeSinceLastBeep = now - lastBeepTimeRef.current;

    if (timeSinceLastBeep >= SNOOZE_INTERVAL_MS) {
      playAlarmSound().catch(() => {});
      lastBeepTimeRef.current = now;
    }
  }, [now, startTime, handleCompleteEvent]);

  // Don't render if storage timer is not active or there are no completed timers
  if (!hasActiveTimer || !hasCompletedTimers || remainingTime <= 0) {
    return null;
  }

  return (
    <div css={styles}>
      <div className="snooze-timer">
        <span>
          {process.env.NODE_ENV === 'development' && <TimerResetIcon />}
          <strong>{formatTimeFromMs(remainingTime)}</strong>
        </span>
      </div>
    </div>
  );
};
