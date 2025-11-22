import React, { useMemo } from 'react';

import clsx from 'clsx';
import { Pad } from 'components/Pads/Pad';

import { useAppConfig } from 'providers/AppConfigProvider/AppConfigContext';

import type { FilterKey, SlotSpecial } from 'types/slots.types';
import { ROUTE_FILTER_KEYS } from 'config/app';
import { styles } from '../PadSlot/PadSlot.styles';

export interface PadMenuProps {
  slotType: SlotSpecial;
  className?: string;
  variant?: 'large' | 'default';
}

export const PadPower: React.FC<PadMenuProps> = ({ slotType, className }) => {
  const { isPowerEnabled, setTogglePowerEnabled } = useAppConfig();

  const mergedClassNames = useMemo(
    () =>
      clsx('pad', `item-type-${slotType}`, className, {
        'pad-special': true,
        'power': true,
        'selected': isPowerEnabled,
      }),
    [slotType, isPowerEnabled, className],
  );

  return (
    <Pad
      css={styles}
      id={slotType}
      name="main"
      type="checkbox"
      value={{ slotType }}
      filterKey={ROUTE_FILTER_KEYS.main as FilterKey}
      isChecked={isPowerEnabled}
      className={mergedClassNames}
      onSelect={() => {
        setTogglePowerEnabled(!isPowerEnabled);
      }}
    />
  );
};
