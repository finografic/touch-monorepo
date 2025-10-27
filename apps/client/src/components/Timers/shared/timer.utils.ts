/**
 * Shared utility functions for all timer components
 * - Sound functions
 * - Time calculations
 * - Event number calculations
 */

import type { TimerItem } from 'providers/TimersProvider';

import { SNOOZE_INTERVAL_MS } from 'config/app';

/**
 * Calculate elapsed time and event number (for millisecond-based timers like snooze)
 */
// NOTE: SnoozeTimer
export function getElapsedTimeAndEventNumberMs(duration: number, remaining: number) {
  const elapsed = Math.max(0, duration - remaining);
  const eventNumber = Math.floor(elapsed / SNOOZE_INTERVAL_MS);
  return { elapsed, eventNumber };
}

/**
 * Calculate cycle number (how many times a timer has repeated)
 */
// NOTE: SnoozeTimer
export function getCycleNumber(totalElapsed: number, intervalMs: number): number {
  return Math.floor(totalElapsed / intervalMs);
}

/**
 * Calculate cycle number (how many times a timer has repeated)
 */
// NOTE: Timer
export function parseCompletionTime({ completionTime }: TimerItem): {
  startTime: number;
  endTime: number;
  remaining: number;
} {
  const startTime = Date.now();
  const endTime = new Date(completionTime!).getTime();
  const remaining = Math.floor((endTime - startTime) / 1000);

  return { startTime, endTime, remaining };
}

/**
 * Calculate cycle number (how many times a timer has repeated)
 */
// NOTE: SnoozeTimer
export function parseElapsedTime({ startTime }: { startTime: number }): {
  remaining: number;
  elapsed: number;
  totalElapsed: number;
} {
  const now = Date.now();
  const totalElapsed = now - startTime;
  const elapsed = totalElapsed % SNOOZE_INTERVAL_MS;
  const remaining = SNOOZE_INTERVAL_MS - elapsed;

  return { remaining, elapsed, totalElapsed };
}
