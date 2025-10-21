import { makeDefaultSound, makeUserSound, playCompleteSound, playTickSound } from 'utils/sound.utils';

import { SNOOZE_INTERVAL_MS } from 'config/app';

// Re-export sound functions for backward compatibility
export { makeDefaultSound, makeUserSound, playCompleteSound, playTickSound };

// Timer tick interval: same as snooze (fires every SNOOZE_INTERVAL_MS / 3)
export const TICK_INTERVAL_MS = SNOOZE_INTERVAL_MS / 3;

/**
 * Timer tick action - fires at regular intervals while timer is running
 * Fires every TICK_INTERVAL_MS (1/3 of snooze cycle)
 */
export function tickAction({
  elapsed,
  remaining,
  orderId,
  eventNumber,
}: {
  elapsed: number;
  remaining: number;
  orderId: string | number;
  eventNumber: number;
}) {
  // NOTE: Only play sound when eventNumber increases
  if (eventNumber > 0) {
    // TODO: REMOVED - no alarm sound, for now..
    playTickSound().catch(() => {
      /* Silent fallback */
    });
  }
}

/**
 * Timer complete action - fires when timer reaches 0
 */
export function completeAction({
  elapsed,
  remaining,
  orderId,
}: {
  elapsed: number;
  remaining: number;
  orderId: string | number;
}) {
  console.log('timer: COMPLETED.', { elapsed, remaining, orderId });
  playCompleteSound().catch(() => {
    // Silent fallback
  });
}

/**
 * Calculate elapsed time and event number for timer
 * Works with seconds (timer durations are in seconds)
 */
export function getElapsedTimeAndEventNumber(duration: number, remaining: number) {
  const elapsed = Math.max(0, duration - remaining);
  // Convert to ms for consistent tick intervals
  const tickIntervalSeconds = Math.floor(TICK_INTERVAL_MS / 1000);
  const eventNumber = Math.floor(elapsed / tickIntervalSeconds);
  return { elapsed, eventNumber };
}
