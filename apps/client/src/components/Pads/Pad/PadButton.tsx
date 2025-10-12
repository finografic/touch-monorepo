import * as React from 'react';
import clsx from 'clsx';
import { padStyles } from './Pad.styles';
import type { PadProps } from './Pad';

export const PadButton: React.FC<PadProps> = ({
  filterFieldKey,
  className,
  children,
  onSelect,
  id,
  label,
  disabled,
  name,
  value,
  index,
  type,
  isChecked,
  filterApiKey,
  metadata,
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
          onSelect?.({
            filterFieldKey,
            pad: {
              id,
              label,
              name,
              value,
              index,
              type,
              isChecked,
              disabled,
              filterApiKey,
              metadata,
              ...rest,
            },
          });
        }
      }}
    >
      {children ?? label}
    </button>
  );
};
