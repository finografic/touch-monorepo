import { useOrders } from 'providers/OrdersProvider';
import { OrderItem } from 'types/orders.types';
import { findOrderByNumber } from 'utils/orders.utils';

type PadProps = {
  number: number;
};

export const Pad = ({ number }: PadProps) => {
  const { togglePad, orders } = useOrders();

  const order = findOrderByNumber(orders, number) as OrderItem;
  const className = ['pad', order?.isSelected && 'active'].filter(Boolean).join(' ');

  const handleClick = () => {
    togglePad(number);
  };

  return <div className={className} onClick={handleClick} />;
};
