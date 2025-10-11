import * as React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { PadButton, PadCheckbox, PadRadio } from '../Pad/index';
import type { PadType, PadUI } from 'types/pads.types';
import type { FilterFieldKey } from 'types/orders.types';
import { CheckboxGroup } from '@radix-ui/themes';
import { PAD_TYPE } from 'types/pads.types';

interface PadGroupProps {
  type: PadType;
  pads: PadUI[];
  onSelect?: ({ fieldKey, pad }: { fieldKey: FilterFieldKey; pad: PadUI }) => void;
  fieldKey: FilterFieldKey;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

// IMPORTANT:  THESE PADS ARE FOR FLOW PAGES *ONLY* / NOT MAIN_PAGE !!

const PadGroup: React.FC<PadGroupProps> = ({
  type,
  pads,
  onSelect,
  fieldKey,
  className,
  children,
  ...rest
}) => {
  // Filter out non-DOM props that shouldn't be passed to DOM elements
  const { labelKey, valueKeys, filterKey, maxPads, minRequired, initChecked, ...domProps } = rest;

  switch (type) {
    case PAD_TYPE.RADIO:
      return (
        <RadioGroup.Root className={className} {...domProps}>
          {pads.map((pad) => (
            <PadRadio key={pad.id} {...pad} fieldKey={fieldKey} onSelect={onSelect} />
          ))}
          {children}
        </RadioGroup.Root>
      );

    case PAD_TYPE.CHECKBOX:
      return (
        <CheckboxGroup.Root className={className} {...domProps}>
          {pads.map((pad) => (
            <PadCheckbox key={pad.id} {...pad} fieldKey={fieldKey} onSelect={onSelect} />
          ))}
          {children}
        </CheckboxGroup.Root>
      );

    case PAD_TYPE.BUTTON:
    default:
      return (
        <div className={className} {...domProps}>
          {pads.map((pad) =>
            pad.type === 'button' ? (
              <PadButton key={pad.id} {...pad} fieldKey={fieldKey} onSelect={onSelect} />
            ) : null,
          )}
          {children}
        </div>
      );
  }
};

export default PadGroup;
