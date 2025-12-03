import React, { useMemo } from 'react';

import clsx from 'clsx';
import { Pad } from 'components/Pads/Pad';
import { Timer } from 'components/Timers/Timer';

import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useTimers } from 'providers/TimersProvider';

import type { FilterKey, SlotType } from 'types/slots.types';
import { ROUTE_FILTER_KEYS } from 'config/app';
import { PadSlotToggle } from './PadSlotToggle';
import { styles } from './PadSlot.styles';

export interface PadMenuProps {
  slotType: SlotType;
  slotNumber: number;
  className?: string;
  variant?: 'large' | 'default';
}

export const PadSlot: React.FC<PadMenuProps> = ({ slotType, slotNumber, className, variant = 'default' }) => {
  const { timers } = useTimers();
  const { selectedSlots, toggleMainPageSlot } = useLayoutUi();

  const isChecked = selectedSlots.some((selectedSlot) => selectedSlot.slotNumber === slotNumber);

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
    console.log(`PadSlot Timer ${slotNumber}: completed - do nothing (from component handler)`);
  }, [slotNumber]);

  if (hasTimer) {
    const isIdleSlotChecked = selectedSlots.some((slot) => slot.status === 'idle');

    return (
      <div style={{ cursor: isIdleSlotChecked ? 'not-allowed' : 'auto' }}>
        <PadSlotToggle
          css={styles}
          slotType={slotType}
          slotNumber={slotNumber}
          status={status}
          isChecked={isChecked}
          // TODO: LEAVE IN OR OUT ??
          // className={clsx(mergedClassNames, { 'checking-blocked': isIdleSlotChecked })}
          className={clsx(mergedClassNames)}
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
      filterKey={ROUTE_FILTER_KEYS.main as FilterKey}
      isChecked={isChecked}
      className={mergedClassNames}
      onSelect={handleSelect}
    />
  );
};
