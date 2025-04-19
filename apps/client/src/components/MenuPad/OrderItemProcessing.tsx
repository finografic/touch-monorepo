import { useOrders } from 'providers/OrdersProvider';
import { OrderItem } from 'types/orders.types';
import { findOrderByNumber } from 'utils/orders.utils';
import { OrderItemPadProps } from './MenuPad.types';
import clsx from 'clsx';
import { styles } from './MenuPad.styles';

export const OrderItemProcessing = ({ number }: OrderItemPadProps) => {
  const { orders } = useOrders();

  const order = findOrderByNumber(orders, number) as OrderItem;
  const isProcessing = order?.processStatus?.isProcessing;

  const className = clsx('pad', {
    'active': order?.isSelected,
    'is-processing': isProcessing,
  });

  const handleClick = () => {
    // if (!isProcessing) {
    //   togglePad(number);
    // }
  };

  return (
    <div css={styles} className={className} onClick={handleClick}>
      {isProcessing && order?.processStatus?.timeRemaining}
    </div>
  );
};
