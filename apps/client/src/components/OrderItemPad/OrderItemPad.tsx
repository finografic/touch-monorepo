import { useOrders } from 'providers/OrdersProvider';
import { OrderItem } from 'types/orders.types';
import { findOrderByNumber } from 'utils/orders.utils';
import { OrderItemProcessing } from './OrderItemProcessing';

type PadProps = {
  number: number;
};

export const OrderItemPad = ({ number }: PadProps) => {
  const { togglePad, orders } = useOrders();

  const order = findOrderByNumber(orders, number) as OrderItem;
  const isProcessing = order?.processStatus?.isProcessing;

  const className = ['pad', order?.isSelected && 'active'].filter(Boolean).join(' ');

  const handleClick = () => {
    if (!isProcessing) {
      togglePad(number);
    }
  };

  if (isProcessing) {
    return <OrderItemProcessing number={number} />;
  }

  return <div className={className} onClick={handleClick} />;
};
