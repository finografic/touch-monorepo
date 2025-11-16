import React, { forwardRef, useCallback, useMemo } from 'react';

import clsx from 'clsx';
import type { DropdownChangeEvent, DropdownProps } from 'primereact/dropdown';
import { Dropdown } from 'primereact/dropdown';

import type { SelectOption } from 'types/models/select-option.model';
import { styles } from './SelectAlt.styles';

/**
 * SelectAltProps extends PrimeReact DropdownProps while maintaining
 * compatibility with the existing SelectCustom interface
 */
interface SelectAltProps
  extends Omit<DropdownProps, 'options' | 'value' | 'onChange' | 'optionLabel' | 'optionValue' | 'onSelect'> {
  /** Array of select options with value and label */
  options: SelectOption[];
  /** Current selected value (string) */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Callback when selection changes - receives the selected value string */
  onSelect?: (value: string) => void;
  /** Allow empty/cleared selection */
  allowEmpty?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** HTML name attribute for form integration */
  name?: string;
  /** Alternative onChange handler for form libraries */
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

/**
 * SelectAlt - PrimeReact-based dropdown component
 *
 * Features:
 * - Editable dropdown (type to search/select)
 * - Extends PrimeReact DropdownProps for full customization
 * - Maintains compatibility with SelectCustom interface
 * - Auto-selects best matching option when typing
 */
export const SelectAlt = forwardRef<Dropdown, SelectAltProps>(
  (
    {
      options,
      value,
      className,
      defaultValue,
      onSelect,
      placeholder = '',
      allowEmpty = false,
      disabled = false,
      name,
      onChange,
      editable = true, // Enable editable by default for type-to-select UX
      showClear = allowEmpty, // Show clear icon when allowEmpty is true
      ...primeReactProps
    },
    ref,
  ) => {
    // Convert SelectOption[] to format PrimeReact expects
    // PrimeReact can work with objects directly if we specify optionLabel and optionValue
    const dropdownOptions = useMemo(() => {
      // Add empty option if allowEmpty is true
      const baseOptions = allowEmpty ? [{ value: '', label: placeholder || '(None)' }, ...options] : options;
      return baseOptions;
    }, [options, allowEmpty, placeholder]);

    // Handle PrimeReact's onChange event
    // PrimeReact passes DropdownChangeEvent with value and originalEvent
    const handleChange = useCallback(
      (e: DropdownChangeEvent) => {
        const newValue = (e.value as string) ?? '';

        try {
          // Use onSelect as primary handler
          if (onSelect) {
            onSelect(newValue);
          } else if (onChange) {
            // Fallback to onChange for form library compatibility
            const event = {
              target: { name, value: newValue },
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange(event);
          }
        } catch (error) {
          console.error('SelectAlt handleChange error:', error);
        }
      },
      [onSelect, onChange, name],
    );

    // Determine current value - handle empty string for allowEmpty
    const currentValue = useMemo(() => {
      if (value !== undefined) {
        return value === '' ? null : value;
      }
      if (defaultValue !== undefined) {
        return defaultValue === '' ? null : defaultValue;
      }
      return null;
    }, [value, defaultValue]);

    return (
      <div css={styles} className={clsx('select-alt', className)}>
        <Dropdown
          ref={ref}
          value={currentValue}
          onChange={handleChange}
          options={dropdownOptions}
          optionLabel="label"
          optionValue="value"
          placeholder={placeholder}
          disabled={disabled}
          editable={editable}
          showClear={showClear}
          className={clsx('select-alt-dropdown', className)}
          {...primeReactProps}
        />
      </div>
    );
  },
);

SelectAlt.displayName = 'SelectAlt';
