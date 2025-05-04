import type { PadUI } from 'types/ui.types';
import type { OrderFieldKey } from 'types/orders.types';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import clsx from 'clsx';
import { padStyles } from './Pad.styles';
import type { FC, ReactNode } from 'react';
import { memo, useCallback, useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';

export interface PadProps extends PadUI {
  fieldKey: OrderFieldKey;
  className?: string;
  children?: ReactNode;
  onSelect?: () => void;
}

const Pad: FC<PadProps> = ({ fieldKey, onSelect, className, children, ...pad }) => {
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

    onSelect?.();
  }, [pad.disabled, pad.type, pad.id, isCheckedOptimistic, fieldKey, updatePadState, onSelect]);

  // Separate state-related classes from passed-in classes
  const stateClasses = {
    checked: pad.isChecked || isCheckedOptimistic,
    disabled: pad.disabled,
    [pad.type]: true, // radio, checkbox, or button
  };

  return (
    <div
      css={padStyles}
      className={clsx('pad', stateClasses, className)}
      onClick={handleClick}
      role={pad.type}
      aria-checked={isCheckedOptimistic}
      data-testid={`pad-${pad.id}`}
    >
      {children ?? pad.label}
    </div>
  );
};

export default memo(Pad, (prevProps, nextProps) => isEqual(prevProps, nextProps));
