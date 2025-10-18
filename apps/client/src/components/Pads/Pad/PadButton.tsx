import * as React from 'react';

import clsx from 'clsx';

import type { PadProps } from './Pad';
import { padStyles } from './Pad.styles';

export const PadButton: React.FC<PadProps> = ({
  filterKey,
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
            filterKey,
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
