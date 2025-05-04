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
import { Pad } from 'components/Pad';
import { OrderFieldKeys } from 'constants/app.config';

export interface MenuPadProps<T extends MenuSlotType> {
  slotType: T; // 'A' | 'B' | 'C'
  number: ValidMenuPadNumber<T>;
  metadata?: DataEntry;
}

export const MenuPad = <T extends MenuSlotType>({ slotType, number, metadata }: MenuPadProps<T>) => {
  const { orders, togglePad } = useOrders();
  // const { orders } = useOrders();

  const order = findOrderByNumber(orders, number) as OrderItem;
  const isProcessing = !!order?.processStatus?.isProcessing;
  const isSelected = !!order?.isSelected;

  const className = clsx(`pad-menu slot-type-${slotType}`, {
    'checked': isSelected,
    'is-processing': isProcessing,
  });

  const handleSelect = React.useCallback(() => {
    console.log('%c order - toggle', 'color:red', number, order?.isSelected);
    togglePad(number);
  }, [number, togglePad]);

  if (order?.isSelected !== undefined) {
    console.log('%c order', 'color:red', order?.isSelected);
  }

  if (!isProcessing) {
    return (
      <Pad
        id={String(number)}
        name={`menu-${slotType}`}
        type="checkbox"
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
