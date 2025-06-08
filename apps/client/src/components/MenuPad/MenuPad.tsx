import React from 'react';
import clsx from 'clsx';
import { useOrders } from 'providers/OrdersProvider';
import type { ItemType, OrderItem } from 'types/orders.types';
import { findOrderByNumber } from 'utils/context.utils';
import { MenuPadToggle } from './MenuPadToggle';
import { styles } from './MenuPad.styles';
import type { ValidMenuPadNumber } from 'pages/MenuPage/MenuPage.types';
import type { DataEntry } from 'types/data.types';
import { Pad } from 'components/Pad';
import { OrderFieldKeys } from 'constants/app.config';
import { Timer } from 'components/Timer/Timer';

export interface MenuPadProps<T extends ItemType> {
  itemType: T;
  number: ValidMenuPadNumber<T>;
  metadata?: DataEntry;
}

export const MenuPad = <T extends ItemType>({ itemType, number, metadata }: MenuPadProps<T>) => {
  const { orders, toggleOrder, timerAction } = useOrders();
  const order = findOrderByNumber(orders, number) as OrderItem;
  const isSelected = !!order?.isSelected;

  // NOTE: Only add menu-specific classes here,
  // let PAD component handle its own state classes
  const className = clsx('pad-menu', `item-type-${itemType}`, `status-${order?.process.status || 'idle'}`);

  const handleSelect = React.useCallback(() => {
    toggleOrder({ itemType, itemNumber: number });
  }, [number, toggleOrder]);

  const handleTimerComplete = React.useCallback(() => {
    timerAction('complete', { itemNumber: number });
  }, [number, timerAction]);

  // Show timer if order is selected and either processing or completed
  if (isSelected && (order?.process.status === 'processing' || order?.process.status === 'completed')) {
    return (
      <MenuPadToggle css={styles} itemType={itemType} number={number} className={className}>
        <Timer
          estimatedCompletionTime={order?.process?.estimatedCompletionTime}
          order={order}
          onComplete={handleTimerComplete}
        />
      </MenuPadToggle>
    );
  }

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
};
