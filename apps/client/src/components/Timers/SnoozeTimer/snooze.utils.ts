import { makeDefaultSound, makeUserSound, playCompleteSound, playTickSound } from 'utils/sound.utils';

import { SNOOZE_INTERVAL_MS } from 'config/app';

// Re-export sound functions for backward compatibility
export { makeDefaultSound, makeUserSound, playCompleteSound, playTickSound };

// Tick interval: Fire tick events every 1/3 of the snooze cycle (e.g., every 10s for 30s cycle)
export const TICK_INTERVAL_MS = SNOOZE_INTERVAL_MS / 3;

/**
 * Snooze tick action - fires at regular intervals while snooze is counting down
 * Fires every TICK_INTERVAL_MS (1/3 of snooze cycle)
 */
export function tickAction({
  elapsedMs,
  remainingMs,
  eventNumber,
}: {
  elapsedMs: number;
  remainingMs: number;
  eventNumber: number;
}) {
  console.log('🔔 SnoozeTimer: TICK', {
    elapsedMs,
    remainingMs,
    eventNumber,
    elapsedSec: Math.floor(elapsedMs / 1000),
    remainingSec: Math.floor(remainingMs / 1000),
  });

  // Play tick sound every tick interval
  if (eventNumber > 0) {
    playTickSound().catch(() => {
      /* Silent fallback */
    });
  }
}

/**
 * Repeat action - fires when snooze timer reaches 0 and is about to repeat
 * This is when the alarm/notification should trigger
 */
export function repeatAction({
  elapsedMs,
  remainingMs,
  cycleNumber,
}: {
  elapsedMs: number;
  remainingMs: number;
  cycleNumber: number;
}) {
  console.log('🔁 SnoozeTimer: REPEAT (cycle complete)', {
    elapsedMs,
    remainingMs,
    cycleNumber,
    elapsedSec: Math.floor(elapsedMs / 1000),
    remainingSec: Math.floor(remainingMs / 1000),
  });

  // Play completion sound when snooze cycle completes
  playCompleteSound().catch(() => {
    /* Silent fallback */
  });

  // TODO: Add custom notification logic here
  // Examples:
  // - Show browser notification
  // - Play alarm sound
  // - Vibrate device
  // - Flash UI element
}

/**
 * Calculate elapsed time and event number for snooze timer
 * Works with milliseconds
 */
export function getElapsedTimeAndEventNumber(durationMs: number, remainingMs: number) {
  const elapsedMs = Math.max(0, durationMs - remainingMs);
  const eventNumber = Math.floor(elapsedMs / TICK_INTERVAL_MS);
  return { elapsedMs, eventNumber };
}

/**
 * Calculate cycle number (how many times the snooze has repeated)
 */
export function getCycleNumber(totalElapsed: number, intervalMs: number): number {
  return Math.floor(totalElapsed / intervalMs);
}
