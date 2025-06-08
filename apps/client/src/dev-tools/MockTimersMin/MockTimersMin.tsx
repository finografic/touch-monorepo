import { useOrders } from 'providers/OrdersProvider';
import { ClockIcon } from '@radix-ui/react-icons';
import { useCallback } from 'react';
import { getFiveSecondEstimate, hasProcessingTimers } from 'utils/timers.utils';
import { styles } from './MockTimersMin.styles';

export const MockTimersMin = () => {
  const { orders, setOrderProcessing } = useOrders();

  const handleSetMinTimers = useCallback(() => {
    const estimatedCompletionTime = getFiveSecondEstimate();

    orders.forEach((order) => {
      if (order.process.status === 'processing') {
        setOrderProcessing({
          itemNumber: order.itemNumber,
          duration: 5,
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
