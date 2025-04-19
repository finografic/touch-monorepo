import clsx from 'clsx';
import type { FC } from 'react';
import { useOrders } from 'providers/OrdersProvider';
import type { OrderItem } from 'types/orders.types';
import { findOrderByNumber } from 'utils/orders.utils';
import type { MenuPadBaseProps } from './MenuPad.types';
import { OrderItemProcessing } from './OrderItemProcessing';
import { OrderItemToggle } from './OrderItemToggle';
import { styles } from './MenuPad.styles';

export const MenuPad: FC<MenuPadBaseProps> = ({ number, className }) => {
  const { orders } = useOrders();

  if (number) {
    const order = findOrderByNumber(orders, number) as OrderItem;
    const isProcessing = order?.processStatus?.isProcessing;

    return isProcessing ? <OrderItemProcessing number={number} /> : <OrderItemToggle number={number} />;
  }

  return <div css={styles} className={clsx('pad', className)} onClick={() => {}} />;
};
