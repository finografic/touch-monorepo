import type { DataEntry } from 'types/data.types';
import type { FilterFieldKey, NavigationFieldKey } from 'types/orders.types';
import type { ConstEnumOf } from '@workspace/core/types/utils';
import type { FilterZZZKey } from 'types/filters.types';

export type PadType = 'radio' | 'checkbox' | 'button';

export const PAD_TYPE: ConstEnumOf<PadType> = {
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  BUTTON: 'button',
} as const;

export interface PadUI {
  id: string;
  label?: string | null;
  name: FilterFieldKey | NavigationFieldKey;
  value: { [K in 'id' | 'name' | string]: string | number | boolean };
  index?: number;
  type: PadType;
  isChecked: boolean;
  filterKey?: FilterZZZKey;
  metadata?: DataEntry;
  disabled?: boolean;
  className?: string;
}

// Base configuration type with all properties required
export interface PadConfigOptions<T extends DataEntry = DataEntry> {
  filterKey?: FilterZZZKey; // TODO: CAREFUL HERE ..
  type: PadType;
  labelKey: keyof T;
  valueKeys: ['id', 'name', ...(keyof T)[]];
  minRequired: number;
  maxPads: number;
  initChecked?: (pad: PadUI) => boolean;
}

export type PadConfig<T extends DataEntry = DataEntry> = PadConfigOptions<T>;
