import { useOrders } from 'providers/OrdersProvider';
import { OrderItem } from 'types/orders.types';
import { findOrderByNumber } from 'utils/orders.utils';

type PadProps = {
  number: number;
};

export const OrderItemProcessing = ({ number }: PadProps) => {
  const { togglePad, orders } = useOrders();

  const order = findOrderByNumber(orders, number) as OrderItem;
  const isProcessing = order?.processStatus?.isProcessing;

  const className = ['pad', order?.isSelected && 'active', isProcessing && 'is-processing']
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (!isProcessing) {
      togglePad(number);
    }
  };

  return (
    <div
      className={className}
      onClick={handleClick}
      style={{ cursor: isProcessing ? 'not-allowed' : 'pointer' }}
    >
      {isProcessing && order?.processStatus?.timeRemaining}
    </div>
  );
};
