export interface OptionUI {
  label: string;
  value: string;
}

export interface PadItem {
  id: number;
  type: 'radio' | 'checkbox';
  name: string;
  isChecked: boolean;
}
