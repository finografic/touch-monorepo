import type { FilterKey } from 'constants/app.config';
import type { DataEntry } from 'types/data.types';
import type { OrderFieldKey } from 'types/orders.types';
import type { ConstEnumOf } from 'types/utilities/enum.utils.types';

export type PadType = 'radio' | 'checkbox' | 'button';

export const PAD_TYPE: ConstEnumOf<PadType> = {
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  BUTTON: 'button',
} as const;

export interface PadUI {
  id: string;
  label: string;
  name: OrderFieldKey;
  value: { [K in 'id' | 'name' | string]: string | number | boolean };
  index?: number;
  type: PadType;
  isChecked: boolean;
  metadata?: DataEntry;
  disabled?: boolean;
  className?: string;
}

// Base configuration type with all properties required
export interface PadConfigOptions<T extends DataEntry = DataEntry> {
  filterKey?: FilterKey;
  type: PadType;
  labelKey: keyof T;
  valueKeys: ['id', 'name', ...(keyof T)[]];
  minRequired: number;
  maxPads: number;
  initChecked?: (pad: PadUI) => boolean;
}

export type PadConfig<T extends DataEntry = DataEntry> = PadConfigOptions<T>;
