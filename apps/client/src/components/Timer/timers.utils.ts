import { playCompleteSound, playTickSound } from './timer.sounds.utils';

export const EVENT_INTERVAL = 120; // seconds

export const formatTime = (seconds: number | undefined): string => {
  if (seconds === undefined) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Re-export sound functions for backward compatibility
export { makeDefaultSound, makeUserSound, playCompleteSound, playTickSound } from './timer.sounds.utils';

// Example tick action (can be customized)
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
    // TODO: REMOVED - no tick sound, for now..
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
