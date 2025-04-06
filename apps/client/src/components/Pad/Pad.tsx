import { useOrders } from 'providers/OrdersProvider';
import { OrderItem } from 'types/orders.types';

type PadProps = {
  number: number;
};

export const Pad = ({ number }: PadProps) => {
  const { togglePad, orders } = useOrders();

  const order = orders.find((order) => order.itemNumber === number) as OrderItem;
  const className = ['pad', order?.isSelected && 'active'].filter(Boolean).join(' ');

  console.log('%c __PAD', 'color:grey', {
    number,
    order,
  });

  const handleClick = () => {
    togglePad(number);
  };

  return <div className={className} onClick={handleClick} />;
};
