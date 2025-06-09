import type { OrderItem } from 'types/orders.types';

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

// Add 5 seconds to current time for estimatedCompletionTime
export const getFiveSecondEstimate = (): string => {
  const date = new Date();
  date.setSeconds(date.getSeconds() + 5);
  return date.toISOString();
};

export const formatTime = (seconds: number | undefined): string => {
  if (seconds === undefined) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
