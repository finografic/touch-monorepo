import { useEffect, useRef, useState } from 'react';
import { useOrders } from 'providers/OrdersProvider';
import type { OrderItem } from 'types/orders.types';
import { getElapsedAndEventNumber, makeDefaultSound, makeUserSound, tickAction } from './timers.utils';

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
  const lastEventFiredRef = useRef<number>(-1);

  // Function to handle timer completion
  const handleTimerComplete = () => {
    const { itemNumber, itemType } = order;
    console.debug('Timer: completing', { itemNumber, itemType });

    // First clear the interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }

    // Then remove from global registry
    if (typeof window !== 'undefined' && window.__timerIntervals) {
      delete window.__timerIntervals[itemNumber];
    }

    // Finally update the order status
    timerAction('complete', { itemNumber });
    onComplete?.();
  };

  useEffect(() => {
    if (!estimatedCompletionTime) {
      console.debug('Timer: no completion time, skipping', { orderId: order.itemNumber });
      setRemainingTime(0);
      return;
    }

    const endTime = new Date(estimatedCompletionTime).getTime();
    const startTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000);

    console.debug('Timer: starting', {
      orderId: order.itemNumber,
      type: order.itemType,
      duration: `${duration}s`,
      endTime: new Date(endTime).toISOString(),
    });

    // Set initial remaining time
    setRemainingTime(Math.max(0, duration));
    lastEventFiredRef.current = -1;

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

      // Calculate elapsed time and event number using utility
      const { elapsed, eventNumber } = getElapsedAndEventNumber(duration, remaining);
      if (eventNumber > lastEventFiredRef.current) {
        lastEventFiredRef.current = eventNumber;
        tickAction({ elapsed, remaining, orderId: order.itemNumber });
      }

      if (remaining <= 0) {
        handleTimerComplete();
      }
    }, 1000);

    // Safely store in global registry
    if (typeof window !== 'undefined') {
      window.__timerIntervals = window.__timerIntervals || {};
      window.__timerIntervals[order.itemNumber] = intervalId;
    }
    intervalRef.current = intervalId;

    return () => {
      console.debug('Timer: cleanup', { orderId: order.itemNumber });
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      if (typeof window !== 'undefined' && window.__timerIntervals) {
        delete window.__timerIntervals[order.itemNumber];
      }
    };
  }, [estimatedCompletionTime, order, timerAction, onComplete]);

  return (
    <>
      <button onClick={() => makeDefaultSound()}>Test Ding</button>
      <button onClick={() => makeUserSound('ring')}>Test Ring</button>
    </>
  );

  return <span>{formatTime(remainingTime)}</span>;
};
