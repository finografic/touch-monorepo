import { useCallback, useEffect, useRef } from 'react';
import { useOrders } from 'providers/OrdersProvider';
import { formatTime } from 'utils/timers.utils';

interface TimerProps {
  orderId: number;
  duration: number;
  onComplete?: () => void;
}

export const Timer = ({ orderId, duration, onComplete }: TimerProps) => {
  const timeoutRef = useRef<number | undefined>(undefined);
  const remainingRef = useRef<number>(duration);
  const { timerAction } = useOrders();

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    // Start the timer
    timerAction('start', { itemNumber: orderId, duration });

    const tick = () => {
      remainingRef.current -= 1;

      if (remainingRef.current <= 0) {
        cleanup();
        timerAction('complete', { itemNumber: orderId });
        onComplete?.();
        return;
      }

      timeoutRef.current = window.setTimeout(tick, 1000);
    };

    timeoutRef.current = window.setTimeout(tick, 1000);

    return () => {
      cleanup();
      timerAction('reset', { itemNumber: orderId });
    };
  }, [cleanup, duration, onComplete, orderId, timerAction]);

  return <div>{formatTime(remainingRef.current)}</div>;
};
