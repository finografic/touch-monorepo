import React from 'react';
import clsx from 'clsx';
import { useOrders } from 'providers/OrdersProvider';
import type { OrderItem } from 'types/orders.types';
import { findOrderByNumber } from 'utils/context.utils';
import { OrderItemToggle } from './OrderItemToggle';
import { OrderItemCountdown } from './OrderItemCountdown';
import { styles } from './MenuPad.styles';
import type { MenuItemType } from 'types/menu.types';
import type { ValidMenuPadNumber } from 'pages/MenuPage/menu.types';
import type { DataEntry } from 'types/data.types';
import { Pad } from 'components/Pad';
import { OrderFieldKeys } from 'constants/app.config';

export interface MenuPadProps<T extends MenuItemType> {
  itemType: T; // 'A' | 'B' | 'C'
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
    toggleOrder(number);
  }, [number, toggleOrder]);

  if (!isProcessing) {
    return (
      <Pad
        css={styles}
        id={String(number)}
        name={`menu-${itemType}`}
        type="checkbox"
        value={{ id: String(number), name: itemType }}
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
      {isProcessing ? <OrderItemCountdown number={number} /> : <React.Fragment />}
    </OrderItemToggle>
  );
};
