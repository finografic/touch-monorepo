import { useOrders } from '../../providers/OrdersProvider';

type PadProps = {
  number: number;
  isFirst?: boolean;
  isError?: boolean;
  isSpecial?: boolean;
};

export const Pad = ({ number, isFirst, isError, isSpecial }: PadProps) => {
  const { togglePad, orders } = useOrders();

  const className = [
    'pad',
    isFirst && 'first',
    isError && 'error',
    isSpecial && 'special',
    orders.find((order) => order.itemNumber === number)?.isSelected && 'active',
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
