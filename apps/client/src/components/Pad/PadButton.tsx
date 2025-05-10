import * as React from 'react';
import clsx from 'clsx';
import { padStyles } from './Pad.styles';
import type { PadProps } from './Pad';

export const PadButton: React.FC<PadProps> = ({
  fieldKey,
  className,
  children,
  onSelect,
  id,
  label,
  disabled,
  ...rest
}) => {
  return (
    <button
      type="button"
      className={clsx('pad', 'button', { disabled }, className)}
      css={padStyles}
      id={id}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          onSelect?.({ fieldKey, pad: { ...rest, id, label, disabled } });
        }
      }}
    >
      {children ?? label}
    </button>
  );
};
