import * as React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { padStyles } from './Pad.styles';
import type { PadProps } from './Pad';

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
  return (
    <Checkbox.Root
      className={clsx('pad', 'checkbox', { checked: isChecked, disabled }, className)}
      css={padStyles}
      id={id}
      checked={isChecked}
      disabled={disabled}
      onCheckedChange={() => {
        if (!disabled) {
          onSelect?.({ fieldKey, pad: { ...rest, id, label, isChecked: !isChecked, disabled } });
        }
      }}
    >
      {children ?? label}
      <Checkbox.Indicator />
    </Checkbox.Root>
  );
};
