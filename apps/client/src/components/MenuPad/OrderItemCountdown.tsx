import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useOrders } from 'providers/OrdersProvider';
import { findOrderByNumber } from 'utils/orders.utils';
import { styles } from './MenuPad.styles';

export const OrderItemCountdown: FC<{ number: number }> = ({ number }) => {
  const { orders } = useOrders();
  const order = findOrderByNumber(orders, number);
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({ minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!order?.processStatus?.estimatedCompletionTime) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const completionTime = new Date(order.processStatus.estimatedCompletionTime!).getTime();
      const difference = completionTime - now;

      if (difference <= 0) {
        return { minutes: 0, seconds: 0 };
      }

      return {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Clear interval when countdown reaches 0
      if (newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [order?.processStatus?.estimatedCompletionTime]);

  return (
    <div css={styles}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
          {String(timeLeft.minutes).padStart(2, '0')} : {String(timeLeft.seconds).padStart(2, '0')}
        </div>
        <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>remaining</div>
      </div>
    </div>
  );
};
