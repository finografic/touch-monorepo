import { useOrders } from 'providers/OrdersProvider';
import { OrderItem } from 'types/orders.types';
import { findOrderByNumber } from 'utils/orders.utils';
import { OrderItemPadProps } from './MenuPad.types';
import clsx from 'clsx';
import { styles } from './MenuPad.styles';

export const OrderItemToggle = ({ number, children }: OrderItemPadProps) => {
  const { togglePad, orders } = useOrders();

  const order = findOrderByNumber(orders, number) as OrderItem;

  const handleClick = () => {
    togglePad(number);
  };

  return (
    <div css={styles} className={clsx('pad', { active: order?.isSelected })} onClick={handleClick}>
      {children}
    </div>
  );
};
