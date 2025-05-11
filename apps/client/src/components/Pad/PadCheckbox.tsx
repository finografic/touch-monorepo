import * as React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { padStyles } from './Pad.styles';
import type { PadProps } from './Pad';
import { useLayoutUi } from 'providers/LayoutUiProvider';

export const PadCheckbox: React.FC<PadProps> = ({
  fieldKey,
  className,
  children,
  onSelect,
  id,
  label,
  isChecked,
  disabled,
  ...rest
}) => {
  console.log('%c __PAD_CHECKBOX:', 'color:lime', { fieldKey, id, label, isChecked, disabled });
  const { togglePad } = useLayoutUi();

  return (
    <Checkbox.Root
      className={clsx('pad', 'checkbox', { checked: isChecked, disabled }, className)}
      css={padStyles}
      id={id}
      checked={isChecked}
      disabled={disabled}
      aria-checked={isChecked}
      onCheckedChange={() => {
        if (!disabled) {
          togglePad(fieldKey, id, 'checkbox');
          onSelect?.({ fieldKey, pad: { ...rest, id, label, isChecked: !isChecked, disabled } });
        }
      }}
    >
      (c) {children ?? label}
      <Checkbox.Indicator />
    </Checkbox.Root>
  );
};
