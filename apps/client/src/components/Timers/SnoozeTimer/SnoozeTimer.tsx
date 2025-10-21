import { useEffect, useRef, useState } from 'react';

import { useTimersOptional } from 'providers/TimersProvider';

import { formatTimeFromMs } from 'utils/time.utils';

import { POLLING_INTERVAL_MS, SNOOZE_INTERVAL_MS } from 'config/app';
import {
  getCycleNumber,
  getElapsedTimeAndEventNumberMs,
  playCompleteSound,
  playTickSound,
} from '../shared/timer.utils';
import { useTimerEvents } from '../shared/useTimerEvents';
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

  // Track last cycle to detect when we've completed a full snooze cycle
  const lastCycleRef = useRef<number>(0);

  // Use shared event handling hook
  const { handleTickEvent, handleCompleteEvent } = useTimerEvents({
    onTick: ({ elapsedMs, remainingMs, eventNumber }) => {
      console.log('🔔 SnoozeTimer: TICK', {
        elapsedMs,
        remainingMs,
        eventNumber,
        elapsedSec: Math.floor((elapsedMs || 0) / 1000),
        remainingSec: Math.floor((remainingMs || 0) / 1000),
      });
      // Play tick sound every tick interval
      if (eventNumber > 0) {
        playTickSound().catch(() => {});
      }
    },
    onComplete: ({ elapsedMs, remainingMs, cycleNumber }) => {
      console.log('🔁 SnoozeTimer: REPEAT (cycle complete)', {
        elapsedMs,
        remainingMs,
        cycleNumber,
        elapsedSec: Math.floor((elapsedMs || 0) / 1000),
        remainingSec: Math.floor((remainingMs || 0) / 1000),
      });
      // Play completion sound when snooze cycle completes
      playCompleteSound().catch(() => {});
      // TODO: Add custom notification logic here
    },
  });

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
      lastCycleRef.current = 0; // Reset cycle tracking
    }

    // Update the previous completed count
    previousCompletedCountRef.current = completedCount;

    // If we have completed timers but no snooze start time, start the snooze timer
    if (!snoozeStartTime) {
      setSnoozeStartTime(Date.now());
      lastCycleRef.current = 0;
    }

    const updateRemainingTime = () => {
      if (!snoozeStartTime) return;

      const now = Date.now();
      const totalElapsed = now - snoozeStartTime;
      const elapsed = totalElapsed % SNOOZE_INTERVAL_MS;
      const remaining = SNOOZE_INTERVAL_MS - elapsed;

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

      // TICK ACTION: Fire at regular intervals (every TICK_INTERVAL_MS)
      const { elapsedMs, eventNumber } = getElapsedTimeAndEventNumberMs(SNOOZE_INTERVAL_MS, remaining);
      handleTickEvent(eventNumber, {
        elapsedMs,
        remainingMs: remaining,
        eventNumber,
      });
    };

    // Initial calculation
    updateRemainingTime();

    // Update every POLLING_INTERVAL_MS
    const intervalId = setInterval(updateRemainingTime, POLLING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [
    hasCompletedTimers,
    snoozeStartTime,
    shouldDebounce,
    completedCount,
    handleTickEvent,
    handleCompleteEvent,
  ]);

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
