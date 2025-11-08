import type { FC, ReactNode } from 'react';
import { memo } from 'react';

import isEqual from 'lodash/isEqual';

import type { FilterKey } from 'types/orders.types';
import type { PadUI } from 'types/pads.types';
import { PadButton } from './PadButton';
import { PadCheckbox } from './PadCheckbox';
import { PadRadio } from './PadRadio';

export interface PadProps extends PadUI {
  filterKey: FilterKey;
  className?: string;
  children?: ReactNode;
  onSelect?: ({ filterKey, pad }: { filterKey: FilterKey; pad: PadUI }) => void;
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
