import clsx from 'clsx';
import type { FC } from 'react';
import { useOrders } from 'providers/OrdersProvider';
import type { OrderItem } from 'types/orders.types';
import { findOrderByNumber } from 'utils/orders.utils';
// import type { MenuPadBaseProps } from './MenuPad.types';
import { OrderItemProcessing } from './OrderItemProcessing';
import { OrderItemToggle } from './OrderItemToggle';
import { OrderItemCountdown } from './OrderItemCountdown';
import { styles } from './MenuPad.styles';
import type { MenuSlotType } from 'types/menu.types';
import type { ValidMenuPadNumber } from 'pages/MenuPage/menu.config';

export interface MenuPadProps<T extends MenuSlotType> {
  type: T;
  number: ValidMenuPadNumber<T>;
  className?: string;
}

export const MenuPad = <T extends MenuSlotType>({ type, number, className }: MenuPadProps<T>) => {
  const { orders } = useOrders();

  if (number) {
    const order = findOrderByNumber(orders, number) as OrderItem;
    const isProcessing = order?.processStatus?.isProcessing;
    const hasCountdown = order?.processStatus?.estimatedCompletionTime;

    if (isProcessing && hasCountdown) {
      return <OrderItemCountdown number={number} />;
    }

    return isProcessing ? <OrderItemProcessing number={number} /> : <OrderItemToggle number={number} />;
  }

  return <div css={styles} className={clsx('pad', className)} onClick={() => {}} />;
};
