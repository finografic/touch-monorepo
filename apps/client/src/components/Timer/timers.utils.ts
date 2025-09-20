import { getCachedSettings, playCachedSound, playSoundFromUrl } from 'utils/soundCache.utils';

export const EVENT_INTERVAL = 15; // seconds

// Initialize the global timer registry if it doesn't exist
if (typeof window !== 'undefined') {
  window.__timerIntervals = window.__timerIntervals || {};
}

export const formatTime = (seconds: number | undefined): string => {
  if (seconds === undefined) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Play the configured tick sound from API with fallback
export async function playTickSound() {
  try {
    const settings = await getCachedSettings();
    if (settings.tick) {
      try {
        await playCachedSound(settings.tick, 0.2);
      } catch (cachedError) {
        console.warn('Cached tick sound failed, trying URL fallback:', cachedError);
        await playSoundFromUrl(settings.tick, 0.2);
      }
    }
  } catch (e) {
    console.warn('Could not play tick sound:', e);
    // Fallback: do nothing
  }
}

// Play the configured finish sound from API with fallback
export async function playFinishSound() {
  try {
    const settings = await getCachedSettings();
    if (settings.finish) {
      try {
        await playCachedSound(settings.finish, 0.2);
      } catch (cachedError) {
        console.warn('Cached finish sound failed, trying URL fallback:', cachedError);
        await playSoundFromUrl(settings.finish, 0.2);
      }
    }
  } catch (e) {
    console.warn('Could not play finish sound:', e);
    // Fallback: do nothing
  }
}

// Legacy functions for backward compatibility
export function makeDefaultSound() {
  playTickSound().catch(() => {
    // Silent fallback
  });
}

export function makeUserSound(key: 'tick' | 'finish') {
  if (key === 'tick') {
    playTickSound().catch(() => {
      // Silent fallback
    });
  } else if (key === 'finish') {
    playFinishSound().catch(() => {
      // Silent fallback
    });
  }
}

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
    // playTickSound().catch(() => { /* Silent fallback */ });
  }
}

// Example finish action (can be customized)
export function finishAction({
  elapsed,
  remaining,
  orderId,
}: {
  elapsed: number;
  remaining: number;
  orderId: string | number;
}) {
  log('timer: FINISHED.', 'orange', { elapsed, remaining, orderId });
  playFinishSound().catch(() => {
    // Silent fallback
  });
}

export function getElapsedAndEventNumber(duration: number, remaining: number) {
  const elapsed = Math.max(0, duration - remaining);
  const eventNumber = Math.floor(elapsed / EVENT_INTERVAL);
  return { elapsed, eventNumber };
}
