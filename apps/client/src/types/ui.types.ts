import type { DataEntry } from 'types/data.types';
import type { ConstEnumOf } from 'types/utilities/enum.utils.types';

export interface OptionUI {
  label: string;
  value: string;
}

export type PadType = 'radio' | 'checkbox' | 'button';

export const PAD_TYPE: ConstEnumOf<PadType> = {
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  BUTTON: 'button',
} as const;

export interface PadUI {
  id: string;
  index?: number;
  label: string;
  name: string;
  type: PadType;
  isChecked: boolean;
  disabled?: boolean;
  className?: string;
  metadata?: DataEntry;
  value: {
    [K in 'name' | 'id' | 'hasSubtypes']?: DataEntry[K];
  };
}

// Base configuration type with all properties required
export interface PadConfigOptions<T extends DataEntry = DataEntry> {
  type: PadType;
  maxPads: number;
  minRequired: number;
  labelKey: keyof T;
  valueKeys: (keyof T)[];
  initChecked: (pad: PadUI) => boolean;
}

// Fully optional configuration
export type PartialPadConfig<T extends DataEntry = DataEntry> = Partial<PadConfigOptions<T>>;

// Mixed configuration with some required and some optional properties
export type MixedPadConfig<T extends DataEntry = DataEntry> = Required<
  Pick<PadConfigOptions<T>, 'maxPads' | 'type'>
> &
  Partial<Omit<PadConfigOptions<T>, 'maxPads' | 'type'>>;

// Default export type - choose which variation you want to use as the main PadConfig
export type PadConfig<T extends DataEntry = DataEntry> = MixedPadConfig<T>;
