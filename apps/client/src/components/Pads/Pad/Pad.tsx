import type { FC, ReactNode } from 'react';
import { memo } from 'react';

import type { Interpolation, Theme } from '@emotion/react';
import isEqual from 'lodash/isEqual';

import type { PadUI } from 'types/pads.types';
import type { FilterKey } from 'types/slots.types';
import { PadButton } from './PadButton';
import { PadCheckbox } from './PadCheckbox';
import { PadRadio } from './PadRadio';

export interface PadProps extends PadUI {
  filterKey: FilterKey;
  className?: string;
  children?: ReactNode;
  onSelect?: ({ filterKey, pad }: { filterKey: FilterKey; pad: PadUI }) => void;
  /** Merged after base pad styles (e.g. `PadSlot.styles`). */
  css?: Interpolation<Theme>;
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
