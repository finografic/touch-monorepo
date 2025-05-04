import React from 'react';
import clsx from 'clsx';
import { useOrders } from 'providers/OrdersProvider';
import type { OrderItem } from 'types/orders.types';
import { findOrderByNumber } from 'utils/context.utils';
// import type { MenuPadBaseProps } from './MenuPad.types';
import { styles } from './MenuPad.styles';
import type { MenuItemType } from 'types/menu.types';
import type { ValidMenuPadNumber } from 'pages/MenuPage/menu.types';
import type { DataEntry } from 'types/data.types';
import { Pad } from 'components/Pad';
import { OrderItemCountdown } from './OrderItemCountdown';
import { OrderFieldKeys } from 'src/config/app.config';

export interface MenuPadProps<T extends MenuItemType> {
  itemType: T; // 'A' | 'B' | 'C'
  number: ValidMenuPadNumber<T>;
  metadata?: DataEntry;
}

export const MenuPad = <T extends MenuItemType>({ itemType, number, metadata }: MenuPadProps<T>) => {
  const { orders, togglePad } = useOrders();

  const order = findOrderByNumber(orders, number) as OrderItem;
  const isProcessing = !!order?.processStatus?.isProcessing;
  const isSelected = !!order?.isSelected;

  const handleSelect = React.useCallback(() => {
    togglePad(number);
  }, [number, togglePad]);

  const className = clsx(`item-type-${itemType}`, {
    'active': isSelected,
    'is-processing': isProcessing,
  });

  return (
    <div css={styles}>
      <Pad
        id={String(number)}
        name={`menu-${itemType}`}
        type="checkbox"
        fieldKey={OrderFieldKeys.home}
        isChecked={isSelected}
        className={className}
        label={String(number)}
        metadata={metadata}
        onSelect={handleSelect}
      />
      {isProcessing && (
        <div className="countdown-overlay">
          <OrderItemCountdown number={number} />
        </div>
      )}
    </div>
  );
};
