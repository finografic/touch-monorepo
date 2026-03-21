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
  /** When true, clicks do not toggle selection (e.g. ALT vs other slots mutual exclusion). */
  disabled?: boolean;
  children: ReactNode;
}

export const PadSlotToggle = ({
  slotType,
  slotNumber,
  status,
  isChecked,
  disabled = false,
  className,
  children,
}: PadSlotToggleProps) => {
  const { toggleMainPageSlot } = useLayoutUi();

  const handleClick = () => {
    if (disabled) return;
    toggleMainPageSlot({ slotType, slotNumber, isChecked, status });
  };

  return (
    <div
      className={clsx(className, { active: isChecked, disabled })}
      onClick={handleClick}
      aria-disabled={disabled}
    >
      {children}
    </div>
  );
};
