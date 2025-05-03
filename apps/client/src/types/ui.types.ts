import type { DataEntry } from 'types/data.types';

export interface OptionUI {
  label: string;
  value: string;
}

export type PadType = 'radio' | 'checkbox';

export interface PadItem {
  id: string;
  key: string;
  label: string;
  type: PadType;
  isChecked: boolean;
  metadata?: DataEntry;
}

// Base configuration type with all properties required
export interface PadsConfigOptions<T extends DataEntry = DataEntry> {
  maxPads: number;
  type: PadType;
  labelKey: keyof T;
  metadataKey: keyof T;
}

// Fully optional configuration
export type PartialPadsConfig<T extends DataEntry = DataEntry> = Partial<PadsConfigOptions<T>>;

// Mixed configuration with some required and some optional properties
export type MixedPadsConfig<T extends DataEntry = DataEntry> = Required<
  Pick<PadsConfigOptions<T>, 'maxPads' | 'type'>
> &
  Partial<Pick<PadsConfigOptions<T>, 'labelKey' | 'metadataKey'>>;

// Default export type - choose which variation you want to use as the main PadsConfig
export type PadsConfig<T extends DataEntry = DataEntry> = MixedPadsConfig<T>;
