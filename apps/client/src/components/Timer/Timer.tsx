import { useEffect, useRef, useState } from 'react';
import { useOrders } from 'providers/OrdersProvider';
import type { OrderItem } from 'types/orders.types';

interface TimerProps {
  estimatedCompletionTime?: string;
  order: OrderItem;
  onComplete?: () => void;
}

// Initialize the global timer registry if it doesn't exist
if (typeof window !== 'undefined') {
  window.__timerIntervals = window.__timerIntervals || {};
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export const Timer = ({ estimatedCompletionTime, order, onComplete }: TimerProps) => {
  const { timerAction } = useOrders();
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    if (!estimatedCompletionTime) {
      setRemainingTime(0);
      return;
    }

    const endTime = new Date(estimatedCompletionTime).getTime();
    const startTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000);

    // Set initial remaining time
    setRemainingTime(Math.max(0, duration));

    if (duration <= 0) {
      timerAction('complete', { itemNumber: order.itemNumber });
      onComplete?.();
      return;
    }

    // Store interval ID in global registry
    const intervalId = setInterval(() => {
      const now = Date.now();
      const remaining = Math.floor((endTime - now) / 1000);

      // Update remaining time state to trigger re-render
      setRemainingTime(Math.max(0, remaining));

      if (remaining <= 0) {
        timerAction('complete', { itemNumber: order.itemNumber });
        onComplete?.();
        clearInterval(intervalId);
        if (typeof window !== 'undefined' && window.__timerIntervals) {
          delete window.__timerIntervals[order.itemNumber];
        }
      }
    }, 1000);

    // Safely store in global registry
    if (typeof window !== 'undefined' && window.__timerIntervals) {
      window.__timerIntervals[order.itemNumber] = intervalId;
    }
    intervalRef.current = intervalId;

    return () => {
      clearInterval(intervalId);
      if (typeof window !== 'undefined' && window.__timerIntervals) {
        delete window.__timerIntervals[order.itemNumber];
      }
    };
  }, [estimatedCompletionTime, order.itemNumber, timerAction, onComplete]);

  return <span>{formatTime(remainingTime)}</span>;
};
