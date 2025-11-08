import React, { forwardRef, useCallback } from 'react';

import { Select } from '@radix-ui/themes';
import clsx from 'clsx';

import type { SelectOption } from 'types/models/select-option.model';
import { styles } from './SelectBasic.styles';

interface SelectBasicProps {
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

export const SelectBasic = forwardRef<HTMLSelectElement, SelectBasicProps>(
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
    const handleValueChange = useCallback(
      (newValue: string) => {
        try {
          if (onSelect) {
            onSelect(newValue);
          } else if (onChange) {
            const event = {
              target: { name, value: newValue },
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange(event);
          }
        } catch (error) {
          console.error('SelectBasic handleValueChange error:', error);
        }
      },
      [onSelect, onChange, name],
    );

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

SelectBasic.displayName = 'SelectBasic';
