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

  // Function to handle timer completion
  const handleTimerComplete = () => {
    console.debug(`Timer completing for order ${order.itemNumber} (${order.itemType})`);

    // First clear the interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }

    // Then remove from global registry
    if (typeof window !== 'undefined' && window.__timerIntervals) {
      delete window.__timerIntervals[order.itemNumber];
    }

    // Finally update the order status
    timerAction('complete', { itemNumber: order.itemNumber });
    onComplete?.();
  };

  useEffect(() => {
    if (!estimatedCompletionTime) {
      setRemainingTime(0);
      return;
    }

    const endTime = new Date(estimatedCompletionTime).getTime();
    const startTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000);

    console.debug(
      `Timer starting for order ${order.itemNumber} (${order.itemType}) with duration ${duration}s`,
    );

    // Set initial remaining time
    setRemainingTime(Math.max(0, duration));

    if (duration <= 0) {
      handleTimerComplete();
      return;
    }

    // Store interval ID in global registry
    const intervalId = setInterval(() => {
      const now = Date.now();
      const remaining = Math.floor((endTime - now) / 1000);

      // Update remaining time state to trigger re-render
      setRemainingTime(Math.max(0, remaining));

      if (remaining <= 0) {
        handleTimerComplete();
      }
    }, 1000);

    // Safely store in global registry
    if (typeof window !== 'undefined' && window.__timerIntervals) {
      window.__timerIntervals[order.itemNumber] = intervalId;
    }
    intervalRef.current = intervalId;

    return () => {
      console.debug(`Timer cleanup for order ${order.itemNumber} (${order.itemType})`);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      if (typeof window !== 'undefined' && window.__timerIntervals) {
        delete window.__timerIntervals[order.itemNumber];
      }
    };
  }, [estimatedCompletionTime, order.itemNumber, order.itemType, timerAction, onComplete]);

  return <span>{formatTime(remainingTime)}</span>;
};
