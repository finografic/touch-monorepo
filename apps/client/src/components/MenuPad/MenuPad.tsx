import React from 'react';
import clsx from 'clsx';
import { useOrders } from 'providers/OrdersProvider';
import type { OrderItem } from 'types/orders.types';
import { findOrderByNumber } from 'utils/context.utils';
import { OrderItemToggle } from './OrderItemToggle';
import { styles } from './MenuPad.styles';
import type { MenuItemType } from 'types/menu.types';
import type { ValidMenuPadNumber } from 'pages/MenuPage/menu.types';
import type { DataEntry } from 'types/data.types';
import { Pad } from 'components/Pad';
import { OrderFieldKeys } from 'constants/app.config';
import { Timer } from 'components/Timer/Timer';

export interface MenuPadProps<T extends MenuItemType> {
  itemType: T;
  number: ValidMenuPadNumber<T>;
  metadata?: DataEntry;
}

export const MenuPad = <T extends MenuItemType>({ itemType, number, metadata }: MenuPadProps<T>) => {
  const { orders, toggleOrder } = useOrders();

  const order = findOrderByNumber(orders, number) as OrderItem;
  const isProcessing = !!order?.processStatus?.isProcessing;
  const isSelected = !!order?.isSelected;

  // NOTE: Only add menu-specific classes here,
  // let PAD component handle its own state classes
  const className = clsx('pad-menu', `item-type-${itemType}`, {
    'is-processing': isProcessing,
  });

  const handleSelect = React.useCallback(() => {
    toggleOrder({ itemType, itemNumber: number });
  }, [number, toggleOrder]);

  if (!isProcessing) {
    return (
      <Pad
        css={styles}
        id={String(number)}
        name="home"
        type="checkbox"
        value={{ id: String(number), itemType }}
        fieldKey={OrderFieldKeys.home}
        isChecked={isSelected}
        className={className}
        label={String(number)}
        metadata={metadata}
        onSelect={handleSelect}
      />
    );
  }

  return (
    <OrderItemToggle css={styles} number={number} className={className}>
      <Timer estimatedCompletionTime={order?.processStatus?.estimatedCompletionTime} />
    </OrderItemToggle>
  );
};
