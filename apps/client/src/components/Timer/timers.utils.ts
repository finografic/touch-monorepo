import { makeDefaultSound, makeUserSound, playCompleteSound, playTickSound } from 'utils/sound.utils';

export const EVENT_INTERVAL = 120; // seconds

// Re-export sound functions for backward compatibility
export { makeDefaultSound, makeUserSound, playCompleteSound, playTickSound };

// Example alarm action (can be customized)
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
  // NOTE: Only play sound every EVENT_INTERVAL (when eventNumber changes)
  if (eventNumber > 0 && remaining % EVENT_INTERVAL === 0) {
    // TODO: REMOVED - no alarm sound, for now..
    playTickSound().catch(() => {
      /* Silent fallback */
    });
  }
}

// Example complete action (can be customized)
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

export function getElapsedTimeAndEventNumber(duration: number, remaining: number) {
  const elapsed = Math.max(0, duration - remaining);
  const eventNumber = Math.floor(elapsed / EVENT_INTERVAL);
  return { elapsed, eventNumber };
}
