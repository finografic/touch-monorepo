import React, { forwardRef, useMemo } from 'react';
import { Select } from '@radix-ui/themes';
import type { SelectOption } from 'types/models/select-option.model';
import clsx from 'clsx';
import { styles } from './SimpleSelect.styles';

interface SimpleSelectProps {
  options: string[] | number[] | SelectOption[];
  value?: string | number;
  className?: string;
  defaultValue?: string | number;
  onSelect?: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SimpleSelect = forwardRef<HTMLSelectElement, SimpleSelectProps>(
  (
    {
      options,
      value,
      className,
      defaultValue,
      onSelect,
      placeholder = '',
      disabled = false,
      name,
      onChange,
      ...props
    },
    ref,
  ) => {
    // Convert simple arrays to SelectOption format
    const selectOptions = useMemo((): SelectOption[] => {
      if (options.length === 0) return [];

      // Check if already SelectOption objects
      if (typeof options[0] === 'object' && 'value' in options[0]) {
        return options as SelectOption[];
      }

      // Convert string[] or number[] to SelectOption[]
      return (options as (string | number)[]).map((option) => ({
        value: String(option),
        label: String(option),
        description: `Option: ${option}`,
        category: 'Simple',
      }));
    }, [options]);

    const handleValueChange = (newValue: string) => {
      // Convert back to original type for onSelect
      if (typeof options[0] === 'object' && 'value' in options[0]) {
        // For SelectOption[], use the string value
        onSelect?.(newValue);
      } else {
        // For string[] or number[], convert back to original type
        const originalOption = options.find((opt) => String(opt) === newValue);
        if (originalOption !== undefined) {
          onSelect?.(originalOption as string | number);
        }
      }

      // Also trigger onChange for React Hook Form
      if (onChange) {
        const event = {
          target: { name, value: newValue },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(event);
      }
    };

    return (
      <div css={styles} className={clsx('simple-select', className)}>
        <Select.Root
          size="3"
          value={value !== undefined ? String(value) : undefined}
          defaultValue={defaultValue !== undefined ? String(defaultValue) : undefined}
          onValueChange={handleValueChange}
          disabled={disabled}
          name={name}
          {...props}
        >
          <Select.Trigger placeholder={placeholder} />
          <Select.Content>
            {selectOptions.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
    );
  },
);

SimpleSelect.displayName = 'SimpleSelect';
