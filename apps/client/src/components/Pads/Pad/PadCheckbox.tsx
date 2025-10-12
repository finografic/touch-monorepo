import * as React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { padStyles } from './Pad.styles';
import type { PadProps } from './Pad';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { PAD_TYPE } from 'types/pads.types';

export const PadCheckbox: React.FC<PadProps> = ({
  filtersKey,
  className,
  children,
  onSelect,
  id,
  label = null,
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
    <Checkbox.Root
      className={clsx('pad', PAD_TYPE.CHECKBOX, { checked: isChecked, disabled }, className)}
      css={padStyles}
      id={id}
      checked={isChecked}
      disabled={disabled}
      aria-checked={isChecked}
      onCheckedChange={() => {
        if (!disabled) {
          togglePad(filtersKey, id, PAD_TYPE.CHECKBOX);
          onSelect?.({
            filtersKey,
            pad: {
              id,
              label,
              name,
              value,
              index,
              type,
              isChecked: !isChecked,
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
      <Checkbox.Indicator />
    </Checkbox.Root>
  );
};
