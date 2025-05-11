import * as React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { PadButton, PadCheckbox, PadRadio } from './index';
import type { PadUI } from 'types/ui.types';
import type { OrderFieldKey } from 'types/orders.types';

interface PadGroupProps {
  type: 'radio' | 'checkbox' | 'button';
  pads: PadUI[];
  onSelect?: ({ fieldKey, pad }: { fieldKey: OrderFieldKey; pad: PadUI }) => void;
  fieldKey: OrderFieldKey;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const PadGroup: React.FC<PadGroupProps> = ({
  type,
  pads,
  onSelect,
  fieldKey,
  className,
  children,
  ...rest
}) => {
  if (type === 'radio') {
    return (
      <RadioGroup.Root className={className} {...rest}>
        {pads.map((pad) => (
          <PadRadio key={pad.id} {...pad} fieldKey={fieldKey} onSelect={onSelect} />
        ))}
        {children}
      </RadioGroup.Root>
    );
  }
  if (type === 'checkbox') {
    return (
      <>
        {pads.map((pad) => (
          <PadCheckbox key={pad.id} {...pad} fieldKey={fieldKey} onSelect={onSelect} />
        ))}
        {children}
      </>
    );
  }
  // fallback for buttons or unknown
  return (
    <>
      {pads.map((pad) =>
        pad.type === 'button' ? (
          <PadButton key={pad.id} {...pad} fieldKey={fieldKey} onSelect={onSelect} />
        ) : null,
      )}
      {children}
    </>
  );
};

export default PadGroup;
