import * as React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import clsx from 'clsx';
import { padStyles } from './Pad.styles';
import type { PadProps } from './Pad';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { PAD_TYPE } from 'types/pads.types';

export const PadRadio: React.FC<PadProps> = ({
  filtersKey,
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
          togglePad(filtersKey, id, PAD_TYPE.RADIO);
          onSelect?.({
            filtersKey,
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
      <RadioGroup.Indicator />
    </RadioGroup.Item>
  );
};
