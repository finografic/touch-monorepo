import * as React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { PadButton, PadCheckbox, PadRadio } from '../Pad/index';
import type { PadType, PadUI } from 'types/pads.types';
import type { FilterKey } from 'types/orders.types';
import { CheckboxGroup } from '@radix-ui/themes';
import { PAD_TYPE } from 'types/pads.types';

interface PadGroupProps {
  type: PadType;
  pads: PadUI[];
  onSelect?: ({ filterFieldKey, pad }: { filterFieldKey: FilterKey; pad: PadUI }) => void;
  filterFieldKey: FilterKey;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

// IMPORTANT:  THESE PADS ARE FOR FLOW PAGES *ONLY* / NOT MAIN_PAGE !!

const PadGroup: React.FC<PadGroupProps> = ({
  type,
  pads,
  onSelect,
  filterFieldKey,
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
            <PadRadio key={pad.id} {...pad} filterFieldKey={filterFieldKey} onSelect={onSelect} />
          ))}
          {children}
        </RadioGroup.Root>
      );

    case PAD_TYPE.CHECKBOX:
      return (
        <CheckboxGroup.Root className={className} {...domProps}>
          {pads.map((pad) => (
            <PadCheckbox key={pad.id} {...pad} filterFieldKey={filterFieldKey} onSelect={onSelect} />
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
              <PadButton key={pad.id} {...pad} filterFieldKey={filterFieldKey} onSelect={onSelect} />
            ) : null,
          )}
          {children}
        </div>
      );
  }
};

export default PadGroup;
