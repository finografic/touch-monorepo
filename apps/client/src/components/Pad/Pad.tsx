import { useOrders } from 'providers/OrdersProvider';
import { OrderItem } from 'types/orders.types';

type PadProps = {
  number: number;
  isFirst?: boolean;
  isError?: boolean;
  isSpecial?: boolean;
};

export const Pad = ({ number, isFirst, isError, isSpecial }: PadProps) => {
  const { togglePad, orders } = useOrders();
  const order = orders.find((order) => order.itemNumber === number) as OrderItem;

  const className = [
    'pad',
    isFirst && 'first',
    isError && 'error',
    isSpecial && 'special',
    order?.isSelected && 'active',
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (!isFirst && !isError && !isSpecial) {
      togglePad(number);
    }
  };

  return <div className={className} onClick={handleClick} />;
};
