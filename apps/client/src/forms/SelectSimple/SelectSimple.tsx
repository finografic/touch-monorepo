import React, { forwardRef } from 'react';
import { Select } from '@radix-ui/themes';
import type { SelectOption } from 'types/models/select-option.model';
import clsx from 'clsx';
import { styles } from './SelectSimple.styles';

interface SelectSimpleProps {
  options: SelectOption[];
  value?: string;
  className?: string;
  defaultValue?: string;
  onSelect?: (value: string) => void;
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
      // Call both handlers with the raw string value
      onSelect?.(newValue);

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
            {options.map(({ value, label }) => (
              <Select.Item key={value} value={value}>
                {label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
    );
  },
);

SelectSimple.displayName = 'SelectSimple';
