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
    name: PadUI['name'];
  } & { [K in keyof DataEntry]?: DataEntry[K] };
}

// Base configuration type with all properties required
export interface PadsConfigOptions<T extends DataEntry = DataEntry> {
  type: PadType;
  maxPads: number;
  minRequired: number;
  labelKey: keyof T;
  metadataKeys?: (keyof T)[];
  initChecked: (pad: PadUI) => boolean;
}

// Fully optional configuration
export type PartialPadsConfig<T extends DataEntry = DataEntry> = Partial<PadsConfigOptions<T>>;

// Mixed configuration with some required and some optional properties
export type MixedPadsConfig<T extends DataEntry = DataEntry> = Required<
  Pick<PadsConfigOptions<T>, 'maxPads' | 'type'>
> &
  Partial<Omit<PadsConfigOptions<T>, 'maxPads' | 'type'>>;

// Default export type - choose which variation you want to use as the main PadsConfig
export type PadsConfig<T extends DataEntry = DataEntry> = MixedPadsConfig<T>;
