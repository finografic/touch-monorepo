import { useOrders } from 'providers/OrdersProvider';
import type { OrderItem } from 'types/orders.types';
import { findOrderByNumber } from 'utils/context.utils';
import type { OrderItemPadProps } from './MenuPad.types';
import clsx from 'clsx';

export const OrderItemToggle = ({ number, className, children }: OrderItemPadProps) => {
  const { togglePad, orders } = useOrders();

  const order = findOrderByNumber(orders, number) as OrderItem;

  const handleClick = () => {
    togglePad(number);
  };

  return (
    <div className={clsx(className, { active: order?.isSelected })} onClick={handleClick}>
      {children}
    </div>
  );
};
