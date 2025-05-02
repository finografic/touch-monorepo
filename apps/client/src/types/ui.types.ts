export interface OptionUI {
  label: string;
  value: string;
}

export type PadType = 'radio' | 'checkbox';

export interface PadItem {
  key: string;
  type: PadType;
  isChecked: boolean;
}

export interface PadsConfig {
  maxPads: number;
  type: PadType;
  labelKey: string;
}
