import * as React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import clsx from 'clsx';
import { padStyles } from './Pad.styles';
import type { PadProps } from './Pad';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { PAD_TYPE } from 'types/pads.types';

export const PadRadio: React.FC<PadProps> = ({
  fieldKey,
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
  filterKey,
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
          togglePad(fieldKey, id, PAD_TYPE.RADIO);
          onSelect?.({
            fieldKey,
            pad: {
              id,
              label,
              name,
              value,
              index,
              type,
              isChecked: true,
              disabled,
              filterKey,
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
