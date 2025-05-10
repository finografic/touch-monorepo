import type { PadUI } from 'types/ui.types';
import type { OrderFieldKey } from 'types/orders.types';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import clsx from 'clsx';
import { padStyles } from './Pad.styles';
import type { FC, ReactNode } from 'react';
import { memo, useCallback } from 'react';
import isEqual from 'lodash/isEqual';

export interface PadProps extends PadUI {
  fieldKey: OrderFieldKey;
  className?: string;
  children?: ReactNode;
  onSelect?: ({ fieldKey, pad }: { fieldKey: OrderFieldKey; pad: PadUI }) => void;
}

const Pad: FC<PadProps> = ({ fieldKey, onSelect, className, children, ...pad }) => {
  const { togglePad } = useLayoutUi();

  const handleClick = useCallback(() => {
    if (pad.disabled) return;

    if (pad.type === 'checkbox') {
      togglePad(fieldKey, pad.id, pad.type);
    } else if (pad.type === 'radio' && !pad.isChecked) {
      togglePad(fieldKey, pad.id, pad.type);
    } else {
      return;
    }

    onSelect?.({
      fieldKey,
      pad: {
        ...pad,
        isChecked: !pad.isChecked, // This is the new state after toggle
      },
    });
  }, [pad.disabled, pad.type, pad.id, pad.isChecked, fieldKey, togglePad, onSelect, pad]);

  // Separate state-related classes from passed-in classes
  const stateClasses = {
    checked: pad.isChecked,
    disabled: pad.disabled,
    [pad.type]: true, // radio, checkbox, or button
  };

  return (
    <div
      css={padStyles}
      className={clsx('pad', stateClasses, className)}
      onClick={handleClick}
      role={pad.type}
      aria-checked={pad.isChecked}
      data-testid={`pad-${pad.id}`}
    >
      {children ?? pad.label}
    </div>
  );
};

export default memo(Pad, (prevProps, nextProps) => isEqual(prevProps, nextProps));
