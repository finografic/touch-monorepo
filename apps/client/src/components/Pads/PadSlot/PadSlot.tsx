import React, { useMemo } from 'react';
import clsx from 'clsx';
import { useOrders } from 'providers/OrdersProvider';
import { useTimers } from 'providers/TimersProvider';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import type { ItemType, OrderItem } from 'types/orders.types';
import { findOrderByNumber } from 'utils/context.utils';
import { PadSlotToggle } from './PadSlotToggle';
import { styles } from './PadSlot.styles';
import type { DataEntry } from 'types/data.types';
import { Pad } from 'components/Pads/Pad';
import { OrderFieldKeys } from 'constants/app.config';
import { TimerV2 } from 'components/Timer/Timer';

export interface PadMenuProps {
  itemType: ItemType;
  number: number;
  metadata?: DataEntry;
  className?: string;
  variant?: 'large' | 'default';
}

export const PadSlot = ({ itemType, number, metadata, className, variant = 'default' }: PadMenuProps) => {
  const { orders } = useOrders();
  const { timers } = useTimers();
  const { mainPageSelectedSlots, toggleMainPageSlot } = useLayoutUi();
  const order = findOrderByNumber(orders, number) as OrderItem;

  // Use LayoutUIContext for selection state instead of OrdersContext
  const isChecked = mainPageSelectedSlots.includes(number);

  // Check if there's a timer for this slot
  const timer = timers.find((t) => t.slotNumber === number);
  const hasTimer = timer && (timer.status === 'processing' || timer.status === 'completed');

  // Always include both 'pad' and 'pad-menu' in the className
  const mergedClassName = useMemo(
    () =>
      clsx('pad', 'pad-menu', `item-type-${itemType}`, className, {
        'pad-large': variant === 'large',
        'status-processing': timer?.status === 'processing',
        'status-completed': timer?.status === 'completed',
        'status-idle': !timer,
        'selected': isChecked && (timer?.status === 'processing' || timer?.status === 'completed'),
      }),
    [itemType, timer?.status, isChecked, className],
  );

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
      <PadSlotToggle css={styles} itemType={itemType} number={number} className={mergedClassName}>
        <TimerV2 key={`timer-${number}`} slotNumber={number} onComplete={handleTimerComplete} />
      </PadSlotToggle>
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
      isChecked={isChecked}
      className={mergedClassName}
      // label={String(number)}
      metadata={metadata}
      onSelect={handleSelect}
    />
  );
};
