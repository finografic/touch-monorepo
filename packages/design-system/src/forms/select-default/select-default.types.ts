export interface SelectOption {
  value: string;
  label?: string;
  description?: string;
  category?: string;
  disabled?: boolean;
}

export interface SelectDefaultProps {
  options: SelectOption[];
  value?: string;
  onSelect?: (value: string) => void;
  /** Fires when value changes — alias for onSelect, RHF Controller compatible */
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Prepend an empty option (value: '') with the placeholder label */
  allowEmpty?: boolean;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  className?: string;
}
