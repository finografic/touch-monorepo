import { useCallback, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { useOrders } from 'providers/OrdersProvider';
import { formatTime } from 'utils/timers.utils';

interface TimerProps {
  orderId: number;
  duration: number;
  onComplete?: () => void;
}

export const Timer = ({ orderId, duration, onComplete }: TimerProps) => {
  const { timerAction } = useOrders();

  // Calculate expiry time (current time + duration in seconds)
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + duration);

  const { seconds, minutes, isRunning, pause, resume, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      timerAction('complete', { itemNumber: orderId });
      onComplete?.();
    },
    autoStart: true,
  });

  // Handle component unmount
  useEffect(() => {
    timerAction('start', { itemNumber: orderId, duration });

    return () => {
      pause(); // Stop the timer
      timerAction('reset', { itemNumber: orderId });
    };
  }, [orderId, duration, timerAction, pause]);

  // Format time for display
  const timeString = formatTime(minutes * 60 + seconds);

  return <div>{timeString}</div>;
};
