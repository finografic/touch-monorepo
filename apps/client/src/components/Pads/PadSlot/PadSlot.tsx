import React, { useMemo } from 'react';
import clsx from 'clsx';
import { useTimers } from 'providers/TimersProvider';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import type { SlotType } from 'types/orders.types';
import { PadSlotToggle } from './PadSlotToggle';
import { styles } from './PadSlot.styles';
import { Pad } from 'components/Pads/Pad';
import { OrderFieldKeys } from 'constants/app.config';
import { Timer } from 'components/Timer/Timer';

export interface PadMenuProps {
  slotType: SlotType;
  slotNumber: number;
  className?: string;
  variant?: 'large' | 'default';
}

export const PadSlot: React.FC<PadMenuProps> = ({ slotType, slotNumber, className, variant = 'default' }) => {
  const { timers } = useTimers();
  const { mainPageSelectedSlots, toggleMainPageSlot } = useLayoutUi();

  const isChecked = mainPageSelectedSlots.some((selectedSlot) => selectedSlot.slotNumber === slotNumber);

  const timer = timers.find((t) => t.slotNumber === slotNumber);
  const hasTimer = timer && (timer.status === 'processing' || timer.status === 'completed');
  const status = timer?.status || 'idle';

  const mergedClassNames = useMemo(
    () =>
      clsx('pad', 'pad-slot', `item-type-${slotType}`, className, {
        'pad-large': variant === 'large',
        'status-processing': timer?.status === 'processing',
        'status-completed': timer?.status === 'completed',
        'status-idle': !timer,
        'selected': isChecked && (timer?.status === 'processing' || timer?.status === 'completed'),
      }),
    [slotType, timer?.status, isChecked, className],
  );

  const handleSelect = React.useCallback(() => {
    toggleMainPageSlot({ slotType, slotNumber, isChecked, status });
  }, [slotNumber, toggleMainPageSlot]);

  const handleTimerComplete = React.useCallback(() => {
    console.log('PadMenu: Timer completed for order', slotNumber);
  }, [slotNumber]);

  if (hasTimer) {
    const isIdleSlotChecked = mainPageSelectedSlots.some((slot) => slot.status === 'idle');

    return (
      <div style={{ cursor: isIdleSlotChecked ? 'not-allowed' : 'auto' }}>
        <PadSlotToggle
          css={styles}
          slotType={slotType}
          slotNumber={slotNumber}
          status={status}
          isChecked={isChecked}
          className={clsx(mergedClassNames, { 'checking-blocked': isIdleSlotChecked })}
        >
          <Timer key={`timer-${slotNumber}`} slotNumber={slotNumber} onComplete={handleTimerComplete} />
        </PadSlotToggle>
      </div>
    );
  }

  return (
    <Pad
      css={styles}
      id={String(slotNumber)}
      name="main"
      type="checkbox"
      value={{ id: String(slotNumber), slotType }}
      fieldKey={OrderFieldKeys.main}
      isChecked={isChecked}
      className={mergedClassNames}
      onSelect={handleSelect}
    />
  );
};
