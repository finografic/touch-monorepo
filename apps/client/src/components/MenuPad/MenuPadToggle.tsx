import { useOrders } from 'providers/OrdersProvider';
import type { OrderItem } from 'types/orders.types';
import { findOrderByNumber } from 'utils/context.utils';
import type { MenuPadProps } from './MenuPad.types';
import clsx from 'clsx';

export const MenuPadToggle = ({ itemType, number, className, children }: MenuPadProps) => {
  const { toggleOrder, orders } = useOrders();

  const order = findOrderByNumber(orders, number) as OrderItem;

  const handleClick = () => {
    toggleOrder({ itemType, itemNumber: number });
  };

  return (
    <div className={clsx(className, { active: order?.isSelected })} onClick={handleClick}>
      {children}
    </div>
  );
};
