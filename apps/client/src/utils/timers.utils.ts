import type { OrderItem } from 'types/orders.types';

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
