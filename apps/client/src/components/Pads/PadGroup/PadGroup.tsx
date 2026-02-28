import * as React from 'react';
import { RadioGroup } from '@workspace/design-system/forms/primitives';

import type { PadType, PadUI } from 'types/pads.types';
import { PAD_TYPE } from 'types/pads.types';
import type { FilterKey } from 'types/slots.types';
import { PadButton, PadCheckbox, PadRadio } from '../Pad/index';

interface PadGroupProps {
  type: PadType;
  pads: PadUI[];
  onSelect?: ({ filterKey, pad }: { filterKey: FilterKey; pad: PadUI }) => void;
  filterKey: FilterKey;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

// IMPORTANT:  THESE PADS ARE FOR FLOW PAGES *ONLY* / NOT MAIN_PAGE !!

const PadGroup: React.FC<PadGroupProps> = ({
  type,
  pads,
  onSelect,
  filterKey,
  className,
  children,
  ...rest
}) => {
  // Filter out non-DOM props that shouldn't be passed to DOM elements
  const { labelKey, valueKeys, filterApiKey, maxPads, minRequired, initChecked, ...domProps } = rest;

  switch (type) {
    case PAD_TYPE.RADIO:
      return (
        <RadioGroup.Root className={className} {...domProps}>
          {pads.map((pad) => (
            <PadRadio key={pad.id} {...pad} filterKey={filterKey} onSelect={onSelect} />
          ))}
          {children}
        </RadioGroup.Root>
      );

    case PAD_TYPE.CHECKBOX:
      return (
        <div className={className} {...domProps}>
          {pads.map((pad) => (
            <PadCheckbox key={pad.id} {...pad} filterKey={filterKey} onSelect={onSelect} />
          ))}
          {children}
        </div>
      );

    case PAD_TYPE.BUTTON:
    default:
      return (
        <div className={className} {...domProps}>
          {pads.map((pad) =>
            pad.type === 'button' ? (
              <PadButton key={pad.id} {...pad} filterKey={filterKey} onSelect={onSelect} />
            ) : null,
          )}
          {children}
        </div>
      );
  }
};

export default PadGroup;
