import * as React from 'react';
import { RadioGroup } from '@workspace/design-system/forms/primitives';

import clsx from 'clsx';

import { useLayoutUi } from 'providers/LayoutUiProvider';

import { PAD_TYPE } from 'types/pads.types';
import type { PadProps } from './Pad';
import { padStyles } from './Pad.styles';

export const PadRadio: React.FC<PadProps> = ({
  filterKey,
  className,
  children,
  onSelect,
  id,
  label,
  isChecked,
  disabled,
  name,
  value,
  index,
  type,
  filterApiKey,
  metadata,
  ...rest
}) => {
  const { togglePad } = useLayoutUi();

  return (
    <RadioGroup.Item
      className={clsx('pad', PAD_TYPE.RADIO, { checked: isChecked, disabled }, className)}
      css={padStyles}
      value={id}
      disabled={disabled}
      aria-checked={isChecked}
      onClick={() => {
        if (!disabled && !isChecked) {
          togglePad(filterKey, id, PAD_TYPE.RADIO);
          onSelect?.({
            filterKey,
            pad: {
              id,
              label,
              name,
              value,
              index,
              type,
              isChecked: true,
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
    </RadioGroup.Item>
  );
};
