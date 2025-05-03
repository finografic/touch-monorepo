import type { PadItem } from 'types/ui.types';
import type { OrderFieldKey } from 'types/orders.types';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import clsx from 'clsx';
import { padStyles } from './Pad.styles';
import type { FC } from 'react';

export interface PadProps {
  pad: PadItem;
  fieldKey: OrderFieldKey;
  isSelected?: boolean;
  className?: string;
  disabled?: boolean;
}

export const Pad: FC<PadProps> = ({ pad, fieldKey, isSelected, className, disabled }) => {
  const { updatePadState } = useLayoutUi();

  const handleClick = () => {
    if (disabled) return;

    const updateFn =
      pad.type === 'radio'
        ? (pads: PadItem[]) => pads.map((p: PadItem) => ({ ...p, isChecked: p.key === pad.key }))
        : (pads: PadItem[]) =>
            pads.map((p: PadItem) => (p.key === pad.key ? { ...p, isChecked: !p.isChecked } : p));

    updatePadState(fieldKey, updateFn);
  };

  return (
    <div
      css={padStyles}
      className={clsx('pad', className, {
        selected: isSelected || pad.isChecked,
        disabled,
        radio: pad.type === 'radio',
        checkbox: pad.type === 'checkbox',
      })}
      onClick={handleClick}
      role={pad.type}
      aria-checked={pad.isChecked}
      data-testid={`pad-${pad.key}`}
    >
      {pad.label}
    </div>
  );
};
