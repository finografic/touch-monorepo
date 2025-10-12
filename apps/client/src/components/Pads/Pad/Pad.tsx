import type { PadUI } from 'types/pads.types';
import type { FilterKey } from 'types/orders.types';
import type { FC, ReactNode } from 'react';
import { memo } from 'react';
import isEqual from 'lodash/isEqual';
import { PadCheckbox } from './PadCheckbox';
import { PadRadio } from './PadRadio';
import { PadButton } from './PadButton';

export interface PadProps extends PadUI {
  filterFieldKey: FilterKey;
  className?: string;
  children?: ReactNode;
  onSelect?: ({ filterFieldKey, pad }: { filterFieldKey: FilterKey; pad: PadUI }) => void;
}

const Pad: FC<PadProps> = (props) => {
  if (props.type === 'checkbox') {
    return <PadCheckbox {...props} />;
  }
  if (props.type === 'radio') {
    return <PadRadio {...props} />;
  }
  if (props.type === 'button') {
    return <PadButton {...props} />;
  }

  return null;
};

export default memo(Pad, (prevProps, nextProps) => isEqual(prevProps, nextProps));
