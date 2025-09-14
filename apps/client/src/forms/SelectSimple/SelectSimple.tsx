import React, { forwardRef, useMemo } from 'react';
import { Select } from '@radix-ui/themes';
import type { SelectOption } from 'types/models/select-option.model';
import clsx from 'clsx';
import { styles } from './SelectSimple.styles';

interface SelectSimpleProps {
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

export const SelectSimple = forwardRef<HTMLSelectElement, SelectSimpleProps>(
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
            {options.map((option) => (
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

SelectSimple.displayName = 'SelectSimple';
