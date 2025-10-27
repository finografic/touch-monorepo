/**
 * Shared utility functions for all timer components
 * - Sound functions
 * - Time calculations
 * - Event number calculations
 */

import type { TimerItem } from 'providers/TimersProvider';

import { makeDefaultSound, makeUserSound, playCompleteSound, playTickSound } from 'utils/sound.utils';

import { SNOOZE_INTERVAL_MS } from 'config/app';

// Re-export sound functions for convenience
export { makeDefaultSound, makeUserSound, playCompleteSound, playTickSound };

/**
 * Tick interval: Fire tick events every 1/3 of the snooze cycle
 * Example: 30s snooze → ticks at 10s, 20s, 30s
 */
export const TICK_INTERVAL_MS = SNOOZE_INTERVAL_MS / 3;

/**
 * Calculate elapsed time and event number (for second-based timers like countdown)
 */
// NOTE: Timer
export function getElapsedTimeAndEventNumberSec(duration: number, remaining: number) {
  const elapsed = Math.max(0, duration - remaining);
  const tickIntervalSeconds = Math.floor(TICK_INTERVAL_MS / 1000);
  const eventNumber = Math.floor(elapsed / tickIntervalSeconds);
  return { elapsed, eventNumber };
}

/**
 * Calculate elapsed time and event number (for millisecond-based timers like snooze)
 */
// NOTE: SnoozeTimer
export function getElapsedTimeAndEventNumberMs(durationMs: number, remainingMs: number) {
  const elapsedMs = Math.max(0, durationMs - remainingMs);
  const eventNumber = Math.floor(elapsedMs / TICK_INTERVAL_MS);
  return { elapsedMs, eventNumber };
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
// NOTE: SnoozeTimer
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
