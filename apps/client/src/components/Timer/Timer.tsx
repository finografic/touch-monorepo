import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { styles } from './Timer.styles';
import type { OrderItem, OrderStatus } from 'types/orders.types';

interface TimerProps {
  estimatedCompletionTime?: string;
  className?: string;
  order: OrderItem;
  onComplete?: (order: OrderItem) => void;
}

export const Timer: FC<TimerProps> = ({ estimatedCompletionTime, className, order, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Ensure the global timer registry exists
    if (!window.__timerIntervals) {
      window.__timerIntervals = {};
    }

    if (!estimatedCompletionTime) {
      console.debug('Timer: No estimatedCompletionTime provided');
      return;
    }

    console.debug('Timer: Initializing with completion time:', estimatedCompletionTime);

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const completionTime = new Date(estimatedCompletionTime).getTime();
      const difference = completionTime - now;

      console.debug('Timer: Difference in ms:', difference);

      if (difference <= 0) {
        return { minutes: 0, seconds: 0 };
      }

      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      console.debug('Timer: Calculated time:', { minutes, seconds });
      return { minutes, seconds };
    };

    // Initial calculation
    const initialTime = calculateTimeLeft();
    console.debug('Timer: Setting initial time:', initialTime);
    setTimeLeft(initialTime);

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Clear interval when countdown reaches 0
      if (newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        console.debug('Timer: Countdown complete');
        clearInterval(timer);
        // Remove from global registry
        if (window.__timerIntervals?.[order.itemNumber] === timer) {
          delete window.__timerIntervals[order.itemNumber];
        }
        // Update order with completed status
        const completedOrder = {
          ...order,
          process: {
            ...order.process,
            status: 'completed' as OrderStatus,
          },
        };
        onComplete?.(completedOrder);
      }
    }, 1000);

    // Store in global registry
    window.__timerIntervals[order.itemNumber] = timer;

    return () => {
      console.debug('Timer: Cleaning up interval');
      clearInterval(timer);
      // Remove from global registry on unmount
      if (window.__timerIntervals?.[order.itemNumber] === timer) {
        delete window.__timerIntervals[order.itemNumber];
      }
    };
  }, [estimatedCompletionTime, order.itemNumber, onComplete]);

  return (
    <div css={styles} className={className}>
      <div className="timer-container">
        <div className="timer-digits">
          {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </div>
        {/* <div className="timer-label">remaining</div> */}
      </div>
    </div>
  );
};
