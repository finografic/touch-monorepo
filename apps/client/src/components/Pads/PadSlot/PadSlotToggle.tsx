import { useLayoutUi } from 'providers/LayoutUiProvider';
import type { PadMenuBaseProps } from './PadSlot.types';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import type { SlotType } from 'types/orders.types';

export interface PadSlotToggleProps extends PadMenuBaseProps {
  slotType: SlotType;
  children: ReactNode;
}

export const PadSlotToggle = ({ slotType, slotNumber, className, children }: PadSlotToggleProps) => {
  const { mainPageSelectedSlots, toggleMainPageSlot } = useLayoutUi();
  const isChecked = mainPageSelectedSlots.includes(slotNumber);

  const handleClick = () => {
    toggleMainPageSlot(slotNumber);
  };

  return (
    <div className={clsx(className, { active: isChecked })} onClick={handleClick}>
      {children}
    </div>
  );
};
