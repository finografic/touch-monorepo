import * as React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import clsx from 'clsx';
import { padStyles } from './Pad.styles';
import type { PadProps } from './Pad';

export const PadRadio: React.FC<PadProps> = ({
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
    <RadioGroup.Item
      className={clsx('pad', 'radio', { checked: isChecked, disabled }, className)}
      css={padStyles}
      value={id}
      disabled={disabled}
      onClick={() => {
        if (!disabled && !isChecked) {
          onSelect?.({ fieldKey, pad: { ...rest, id, label, isChecked: true, disabled } });
        }
      }}
    >
      {children ?? label}
      <RadioGroup.Indicator />
    </RadioGroup.Item>
  );
};
