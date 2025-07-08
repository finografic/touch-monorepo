import { useOrders } from 'providers/OrdersProvider';
import type { OrderItem } from 'types/orders.types';
import { findOrderByNumber } from 'utils/context.utils';
import type { PadMenuProps } from './PadMenu.types';
import clsx from 'clsx';

export const PadMenuToggle = ({ itemType, number, className, children }: PadMenuProps) => {
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
