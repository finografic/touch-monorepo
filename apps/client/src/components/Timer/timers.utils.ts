import type { OrderItem } from 'types/orders.types';
import { playCachedSound, playSoundFromUrl, getCachedSettings } from 'utils/soundCache.utils';

export const EVENT_INTERVAL = 5; // seconds

// Initialize the global timer registry if it doesn't exist
if (typeof window !== 'undefined') {
  window.__timerIntervals = window.__timerIntervals || {};
}

export const hasProcessingTimers = (orders: OrderItem[]): boolean => {
  return orders.some((order) => order.process.status === 'processing');
};

export const hasCompletedTimers = (orders: OrderItem[]): boolean => {
  return orders.some((order) => order.process.status === 'completed');
};

export const formatTime = (seconds: number | undefined): string => {
  if (seconds === undefined) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Play the configured tick sound from API with fallback
export async function makeTickSound() {
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
export async function makeFinishSound() {
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
  makeTickSound().catch(() => {
    // Silent fallback
  });
}

export function makeUserSound(key: 'tick' | 'finish') {
  if (key === 'tick') {
    makeTickSound().catch(() => {
      // Silent fallback
    });
  } else if (key === 'finish') {
    makeFinishSound().catch(() => {
      // Silent fallback
    });
  }
}

// Example tick action (can be customized)
export function tickAction({
  elapsed,
  remaining,
  orderId,
}: {
  elapsed: number;
  remaining: number;
  orderId: number;
}) {
  console.log(`EVENT: ${elapsed}s elapsed, ${remaining}s remaining (order ${orderId})`);
  // Play configured tick sound
  makeTickSound().catch(() => {
    // Silent fallback
  });
}

// Example finish action (can be customized)
export function finishAction({
  elapsed,
  remaining,
  orderId,
}: {
  elapsed: number;
  remaining: number;
  orderId: number;
}) {
  console.log('EVENT: TIMER FINISHED', { elapsed, remaining, orderId });
  makeFinishSound().catch(() => {
    // Silent fallback
  });
}

export function getElapsedAndEventNumber(duration: number, remaining: number) {
  const elapsed = Math.max(0, duration - remaining);
  const eventNumber = Math.floor(elapsed / EVENT_INTERVAL);
  return { elapsed, eventNumber };
}
