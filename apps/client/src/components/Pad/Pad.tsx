import type { PadUI } from 'types/ui.types';
import type { OrderFieldKey } from 'types/orders.types';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import clsx from 'clsx';
import { padStyles } from './Pad.styles';
import type { FC } from 'react';
import { memo, useCallback, useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';

export interface PadProps extends PadUI {
  fieldKey: OrderFieldKey;
  className?: string;
  onSelect?: () => void;
}

const Pad: FC<PadProps> = ({ fieldKey, className, onSelect, ...pad }) => {
  const { updatePadState } = useLayoutUi();
  const [isCheckedOptimistic, setIsCheckedOptimistic] = useState(pad.isChecked);

  useEffect(
    function syncWithActualState() {
      setIsCheckedOptimistic(pad.isChecked);
    },
    [pad.isChecked],
  );

  const handleClick = useCallback(() => {
    if (pad.disabled) return;

    const newCheckedState = pad.type === 'radio' ? true : !isCheckedOptimistic;
    setIsCheckedOptimistic(newCheckedState);

    // Update global state
    const updateFn =
      pad.type === 'radio'
        ? (pads: PadUI[]) =>
            pads.map((p: PadUI) => ({
              ...p,
              isChecked: p.id === pad.id,
            }))
        : (pads: PadUI[]) =>
            pads.map((p: PadUI) => (p.id === pad.id ? { ...p, isChecked: !p.isChecked } : p));

    updatePadState(fieldKey, updateFn);

    // Call the onSelect callback if provided
    onSelect?.();
  }, [pad.disabled, pad.type, pad.id, isCheckedOptimistic, fieldKey, updatePadState, onSelect]);

  return (
    <div
      css={padStyles}
      className={clsx('pad', className, {
        selected: pad.isChecked || isCheckedOptimistic,
        disabled: pad.disabled,
        radio: pad.type === 'radio',
        checkbox: pad.type === 'checkbox',
      })}
      onClick={handleClick}
      role={pad.type}
      aria-checked={isCheckedOptimistic}
      data-testid={`pad-${pad.id}`}
    >
      {pad.label}
    </div>
  );
};

export default memo(Pad, (prevProps, nextProps) => isEqual(prevProps, nextProps));
