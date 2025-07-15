import type { OrderItem } from 'types/orders.types';
import soundTickFile from './sounds/fx-ding.mp3';
import soundFinishFile from './sounds/fx-ring.mp3';

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

// Play the default sound (fx-ding.mp3 in local sounds/ folder)
export function makeDefaultSound() {
  try {
    const audio = new window.Audio(soundTickFile);
    audio.volume = 0.2;
    audio.play();
  } catch (e) {
    // Fallback: do nothing
  }
}

// Play a user sound by key ('ding' or 'ring')
export function makeUserSound(key: 'tick' | 'finish') {
  try {
    let url = '';
    if (key === 'tick') url = soundTickFile;
    if (key === 'finish') url = soundFinishFile;
    if (!url) return;
    const audio = new window.Audio(url);
    audio.volume = 0.2;
    audio.play();
  } catch (e) {
    // Fallback: do nothing
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
  // Example: play sound every interval
  // makeDefaultSound();
  makeUserSound('tick');
}

// Example tick action (can be customized)
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
  makeUserSound('finish');
}

export function getElapsedAndEventNumber(duration: number, remaining: number) {
  const elapsed = Math.max(0, duration - remaining);
  const eventNumber = Math.floor(elapsed / EVENT_INTERVAL);
  return { elapsed, eventNumber };
}
