import clsx from 'clsx';
import type { SlotStatus } from 'pages/MainPage/MainPage.types';
import type { ReactNode } from 'react';

import { useLayoutUi } from 'providers/LayoutUiProvider';
import type { SlotType } from 'types/orders.types';

import type { PadMenuBaseProps } from './PadSlot.types';

export interface PadSlotToggleProps extends PadMenuBaseProps {
  slotType: SlotType;
  status: SlotStatus;
  isChecked: boolean;
  children: ReactNode;
}

export const PadSlotToggle = ({
  slotType,
  slotNumber,
  status,
  isChecked,
  className,
  children,
}: PadSlotToggleProps) => {
  const {
    // mainPageSelectedSlots,
    toggleMainPageSlot,
  } = useLayoutUi();
  // const isChecked = mainPageSelectedSlots.includes({
  //   slotType,
  //   slotNumber,
  //   isChecked,
  //   status: timer?.status || 'idle',
  // });

  // log('__CHECKBOX:', 'hotpink', {
  //   slotType,
  //   slotNumber,
  //   status,
  //   isChecked,
  // });

  const handleClick = () => {
    toggleMainPageSlot({ slotType, slotNumber, isChecked, status });
  };

  return (
    <div className={clsx(className, { active: isChecked })} onClick={handleClick}>
      {children}
    </div>
  );
};
