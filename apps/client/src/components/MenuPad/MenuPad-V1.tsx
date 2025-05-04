import React from 'react';
import clsx from 'clsx';
import { useOrders } from 'providers/OrdersProvider';
import type { OrderItem } from 'types/orders.types';
import { findOrderByNumber } from 'utils/context.utils';
// import type { MenuPadBaseProps } from './MenuPad.types';
import { OrderItemToggle } from './OrderItemToggle';
import { OrderItemCountdown } from './OrderItemCountdown';
import { styles } from './MenuPad.styles';
import type { MenuSlotType } from 'types/menu.types';
import type { ValidMenuPadNumber } from 'pages/MenuPage/menu.types';
import type { DataEntry } from 'types/data.types';

export interface MenuPadProps<T extends MenuSlotType> {
  slotType: T; // 'A' | 'B' | 'C'
  number: ValidMenuPadNumber<T>;
  metadata?: DataEntry;
}

export const MenuPad = <T extends MenuSlotType>({ slotType, number, metadata }: MenuPadProps<T>) => {
  const { orders } = useOrders();
  // const { orders } = useOrders();

  const order = findOrderByNumber(orders, number) as OrderItem;
  const isProcessing = !!order?.processStatus?.isProcessing;

  const className = clsx(`pad slot-type-${slotType}`, {
    'active': order?.isSelected,
    'is-processing': isProcessing,
  });

  return (
    <OrderItemToggle css={styles} number={number} className={className}>
      {isProcessing ? <OrderItemCountdown number={number} /> : <React.Fragment />}
    </OrderItemToggle>
  );
};
