import { useLayoutUi } from 'providers/LayoutUiProvider';
import type { PadMenuProps } from './PadSlot.types';
import clsx from 'clsx';

export const PadSlotToggle = ({ itemType, number, className, children }: PadMenuProps) => {
  const { mainPageSelectedSlots, toggleMainPageSlot } = useLayoutUi();

  // Use LayoutUIContext for selection state
  const isSelected = mainPageSelectedSlots.includes(number);

  const handleClick = () => {
    // Toggle selection using LayoutUIContext (doesn't create orders)
    toggleMainPageSlot(number);
  };

  return (
    <div className={clsx(className, { active: isSelected })} onClick={handleClick}>
      {children}
    </div>
  );
};
