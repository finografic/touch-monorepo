import { useOrders } from 'providers/OrdersProvider';
import { ClockIcon } from '@radix-ui/react-icons';
import { useCallback } from 'react';
import { hasProcessingTimers } from 'utils/timers.utils';
import { styles } from './MockTimersMin.styles';

export const MockTimersMin = () => {
  const { orders, setOrderProcessing } = useOrders();

  const handleSetMinTimers = useCallback(() => {
    // Configuration for timer reduction
    const PERCENTAGE = 0.075; // 10% of remaining time (adjust as needed: 0.05 = 5%, 0.2 = 20%)
    const MIN_DURATION = 3; // Minimum 3 seconds fallback

    orders.forEach((order) => {
      if (order.process.status === 'processing' && order.process.timeRemaining) {
        // Calculate percentage of remaining time
        const percentageDuration = Math.floor(order.process.timeRemaining * PERCENTAGE);

        // Use the larger of percentage or minimum duration
        // This preserves relative timing differences while ensuring no timer is too short
        const newDuration = Math.max(percentageDuration, MIN_DURATION);

        console.debug(
          `Timer ${order.itemNumber}: ${order.process.timeRemaining}s → ${newDuration}s (${Math.round(PERCENTAGE * 100)}% or min ${MIN_DURATION}s)`,
        );

        setOrderProcessing({
          itemNumber: order.itemNumber,
          duration: newDuration,
          preserveSelection: true,
        });
      }
    });
  }, [orders, setOrderProcessing]);

  // Only show when there are processing timers
  if (!hasProcessingTimers(orders)) return null;

  return (
    <button className="btn-dev" css={styles} onClick={handleSetMinTimers}>
      <ClockIcon />
    </button>
  );
};
