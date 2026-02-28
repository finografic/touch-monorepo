/** Shared option shape for Select and SelectSearchable. */
export interface SelectOption {
  value: string;
  label?: string;
  description?: string;
  category?: string;
  disabled?: boolean;
}
