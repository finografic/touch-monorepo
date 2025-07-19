import React, { useMemo } from 'react';
import clsx from 'clsx';
import { useOrders } from 'providers/OrdersProvider';
import { useTimers } from 'providers/TimersProvider';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import type { ItemType, OrderItem } from 'types/orders.types';
import { findOrderByNumber } from 'utils/context.utils';
import { PadMenuToggle } from './PadMenuToggle';
import { styles } from './PadMenu.styles';
import type { DataEntry } from 'types/data.types';
import { Pad } from 'components/Pads/Pad';
import { OrderFieldKeys } from 'constants/app.config';
import { TimerV2 } from 'components/Timer/TimerV2';

export interface PadMenuProps {
  itemType: ItemType;
  number: number;
  metadata?: DataEntry;
}

export const PadMenu = ({ itemType, number, metadata }: PadMenuProps) => {
  const { orders } = useOrders();
  const { timers } = useTimers();
  const { mainPageSelectedSlots, toggleMainPageSlot } = useLayoutUi();
  const order = findOrderByNumber(orders, number) as OrderItem;

  // Use LayoutUIContext for selection state instead of OrdersContext
  const isSelected = mainPageSelectedSlots.includes(number);

  // Check if there's a timer for this order
  const timer = timers.find((t) => t.orderId === number);
  const hasTimer = timer && (timer.status === 'processing' || timer.status === 'completed');

  // NOTE: Only add menu-specific classes here,
  // let PAD component handle its own state classes
  const className = clsx('pad-menu', `item-type-${itemType}`, {
    // Apply timer status classes based on TimersContext
    'status-processing': timer?.status === 'processing',
    'status-completed': timer?.status === 'completed',
    'status-idle': !timer,
    // Add selected class for running timers that are selected
    'selected': isSelected && (timer?.status === 'processing' || timer?.status === 'completed'),
  });

  const handleSelect = React.useCallback(() => {
    toggleMainPageSlot(number);
  }, [number, toggleMainPageSlot]);

  const handleTimerComplete = React.useCallback(() => {
    // Timer completion is now handled by TimerV2 component
    console.log('PadMenu: Timer completed for order', number);
  }, [number]);

  // Show timer if there's a timer for this order (regardless of selection)
  if (hasTimer) {
    return (
      <PadMenuToggle css={styles} itemType={itemType} number={number} className={className}>
        <TimerV2 orderId={number} onComplete={handleTimerComplete} />
      </PadMenuToggle>
    );
  }

  return (
    <Pad
      css={styles}
      id={String(number)}
      name="main"
      type="checkbox"
      value={{ id: String(number), itemType }}
      fieldKey={OrderFieldKeys.main}
      isChecked={isSelected}
      className={className}
      label={String(number)}
      metadata={metadata}
      onSelect={handleSelect}
    />
  );
};
