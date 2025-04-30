export interface OptionUI {
  label: string;
  value: string;
}

export type PadType = 'radio' | 'checkbox';

export interface PadItem {
  index: number;
  id: string;
  type: PadType;
  isChecked: boolean;
}
