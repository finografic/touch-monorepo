import type { PadItem } from 'types/ui.types';
import type { OrderFieldKey } from 'types/orders.types';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import clsx from 'clsx';
import { padStyles } from './Pad.styles';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';

export interface PadProps {
  pad: PadItem;
  fieldKey: OrderFieldKey;
  isSelected?: boolean;
  className?: string;
  disabled?: boolean;
}

export const Pad: FC<PadProps> = ({ pad, fieldKey, isSelected, className, disabled }) => {
  const { updatePadState } = useLayoutUi();
  // Local optimistic state
  const [isCheckedOptimistic, setIsCheckedOptimistic] = useState(pad.isChecked);

  // Sync with actual state
  useEffect(() => {
    setIsCheckedOptimistic(pad.isChecked);
  }, [pad.isChecked]);

  const handleClick = useCallback(() => {
    if (disabled) return;

    // Optimistically update local state
    const newCheckedState = pad.type === 'radio' ? true : !isCheckedOptimistic;
    setIsCheckedOptimistic(newCheckedState);

    // Update global state
    const updateFn =
      pad.type === 'radio'
        ? (pads: PadItem[]) =>
            pads.map((p: PadItem) => ({
              ...p,
              isChecked: p.key === pad.key,
            }))
        : (pads: PadItem[]) =>
            pads.map((p: PadItem) => (p.key === pad.key ? { ...p, isChecked: !p.isChecked } : p));

    updatePadState(fieldKey, updateFn);
  }, [disabled, pad.type, pad.key, isCheckedOptimistic, fieldKey, updatePadState]);

  return (
    <div
      css={padStyles}
      className={clsx('pad', className, {
        selected: isSelected || isCheckedOptimistic,
        disabled,
        radio: pad.type === 'radio',
        checkbox: pad.type === 'checkbox',
      })}
      onClick={handleClick}
      role={pad.type}
      aria-checked={isCheckedOptimistic}
      data-testid={`pad-${pad.key}`}
    >
      {pad.label}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default Pad;
