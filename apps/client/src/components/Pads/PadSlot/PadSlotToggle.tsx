import type { ReactNode } from 'react';

import clsx from 'clsx';
import type { SlotStatus } from 'pages/MainPage/MainPage.types';

import { useLayoutUi } from 'providers/LayoutUiProvider';

import type { SlotType } from 'types/slots.types';
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
  const { toggleMainPageSlot } = useLayoutUi();

  const handleClick = () => {
    toggleMainPageSlot({ slotType, slotNumber, isChecked, status });
  };

  return (
    <div className={clsx(className, { active: isChecked })} onClick={handleClick}>
      {children}
    </div>
  );
};
